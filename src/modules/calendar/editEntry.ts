import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NavParams, NavController, LoadingController, Loading, AlertController, Platform } from 'ionic-angular';
import { ModuleBase } from '../module-base';
import { AuthenticationService } from '../../providers/authentication/authentication-service';
import { LoginRedirectService } from '../../providers/authentication/login-redirect-service';
import { confirmAction } from '../../utilities/ConfirmActionAlert';
import { CalendarEntry } from './calendarEntry';
import dateFormat from 'dateformat';
import { AppointmentRemoteService } from "../../providers/remote-services/appointment-remote-service";
import { AddressRemoteService } from "../../providers/remote-services/address-remote-service";

declare var _paq: any;

/**
* All normal modules must extend ModuleBase and have to be
* decorated by @Page
**/
@Component({
  templateUrl: 'editEntry.html'
})

export class CalendarEditEntry extends ModuleBase {

  public needsAuth: boolean = false;
  // ask for confirmation when leavin, if data has changed
  public hasChanged: boolean = false;
  // if false, this component is used to create new entries
  public isEditing: boolean = false;
  // if true this page can be left without alert
  public canLeave: boolean = true;
  public needsConfirmToLeave = true;
  public startH: string = "";
  public startM: string = "";
  public endH: string = "";
  public endM: string = "";

  public entry: CalendarEntry;
  public formControls: FormGroup;
  // public dateTimeModel: any = {
  //   start: null,
  //   end: null
  // }
  public participantOptions: Array<any>; // list of possible participants
  public valueChangeSub;
  public alertActive;

  public title: AbstractControl;
  private endTimeTouched = false;

  constructor(
    public params: NavParams,
    public authService: AuthenticationService,
    public nav: NavController,
    public fb: FormBuilder,
    public loading: LoadingController,
    public alertController: AlertController,
    public loginRedirectService: LoginRedirectService,
    public platform: Platform,
    public appointmentService: AppointmentRemoteService,
    public addressService: AddressRemoteService
  ) {
    super(params, nav, loginRedirectService);
    let entryParams = params.get('params');

    // if data is delivered, we are EDITING this entry
    if (entryParams && entryParams.data) {
      this.initEdit(entryParams);
      // if no data is delivered, but a date, take this date as the start
    } else if (entryParams) {
      let d = new Date(entryParams);
      this.initCreate(d.toISOString());
    }
    //if no data at all is delivered, take current date
    else {
      this.initCreate();
    }
    // this.startH = new Date(this.entry.start).getHours().toString();
    if (!this.entry.participants) {
      this.entry.participants = [];
    }
    // building the form controls data
    this.formControls = this.fb.group({
      title: [this.entry.title, Validators.compose([Validators.maxLength(80), Validators.required])],
      startH: [this.startH, Validators.compose([Validators.pattern('[0-2][0-9]\:[0-9][0-9]')])],
      startM: [this.startM, Validators.compose([Validators.pattern('[0-9][0-9]\.[0-9][0-9]\.[0-9][0-9][0-9][0-9]'), Validators.required])],
      endH: [this.endH, Validators.compose([Validators.pattern('[0-2][0-9]\:[0-9][0-9]')])],
      endM: [this.endM, Validators.compose([Validators.pattern('[0-9][0-9]\.[0-9][0-9]\.[0-9][0-9][0-9][0-9]'), Validators.required])],
      allDay: [this.entry.allDay],
      recurse: [this.entry.recurse],
      recursionPattern: [this.entry.recursionPattern],
      description: [this.entry.description],
      location: [this.entry.location],
      participants: [this.entry.participants.map(p => p.GGUID)] // currently selected /attending participants, by GGUID
    });

    this.title = this.formControls.controls['title'];

    // we have to hold the datetime in a separate model
    // to keep track of and sync changes while editing
    // this.dateTimeModel = {
    //   start: this.entry.start,
    //   end: this.entry.end
    // };
    // listen for changes
    this.valueChangeSub = this.formControls.valueChanges.subscribe(formData => {
      this.hasChanged = true;
      this.canLeave = false;
      this.startH = formData.startH;
      this.startM = formData.startM;
      this.endH = formData.endH;
      this.endM = formData.endM;
      var regex = new RegExp("[0-2][0-9]\:[0-9][0-9]");
      if (!this.endTimeTouched && !this.isEditing && regex.test(this.startH)) {
        //if end date has not yet been manually set, automatically adapt it to 1 hour after start date
        let formStart = new Date(+this.startM.split("\.")[2], +this.startM.split("\.")[1] - 1, +this.startM.split("\.")[0], +this.startH.split("\:")[0], +this.startH.split("\:")[1]);
        this.endH = dateFormat(CalendarEntry.addHours(new Date(formStart), 1), "HH:MM");
        this.endTimeTouched = true;
        this.formControls.patchValue({ endH: this.endH });
        // formData.endH = this.endH;
      }
      this.entry.allDay = formData.allDay;
      this.entry.title = formData.title;
      this.entry.recurse = formData.recurse;
      this.entry.recursionPattern = formData.recursionPattern;
      this.entry.description = formData.description;
      this.entry.location = formData.location;
      this.entry.participants = formData.participants;
    },
      error => {
        console.log(error);
      });
  }

  ionViewWillEnter() {
    // create possible participant options
    this.createParticipantOptions();
  }

  initEdit(entryParams) {
    this.isEditing = true;

    let entryData = entryParams.data;

    if (entryData instanceof CalendarEntry) {
      this.entry = entryData;
      //set the field values
      this.startM = dateFormat(new Date(this.entry.start), "dd.mm.yyyy");
      this.startH = dateFormat(new Date(this.entry.start), "HH:MM");
      this.endM = dateFormat(new Date(this.entry.end), "dd.mm.yyyy");
      this.endH = dateFormat(new Date(this.entry.end), "HH:MM");
    } else {
      this.entry = new CalendarEntry(entryData);
    }
  }

  initCreate(date?: string) {
    this.isEditing = false;
    var today = false;
    if (!date) {
      date = new Date().toISOString();
      today = true;
    }
    // get perpopulated with default values if no data is given to constructor
    this.entry = new CalendarEntry();
    this.entry.start = date;
    this.entry.end = CalendarEntry.addHours(new Date(date), 1).toISOString();
    this.startM = dateFormat(new Date(this.entry.start), "dd.mm.yyyy");
    this.endM = dateFormat(new Date(this.entry.end), "dd.mm.yyyy");
    if (today) {
      this.startH = dateFormat(new Date(this.entry.start), "HH:MM");
      this.endH = dateFormat(new Date(this.entry.end), "HH:MM");
    }
    // let dd = new Date(dateFormat(this.startM, "isoDateTime"));
    // set current user as "Klient"
    this.authService.initService().then(_credentials => {
      this.entry.klient = {
        firstname: this.authService.userCredentials.firstname,
        GGUID: this.authService.userCredentials.GGUID,
        lastname: this.authService.userCredentials.lastname
      };
    });

  }

  createParticipantOptions() {
    // each connected user is a checkable participant, and editable
    this.participantOptions = [];
    this.authService.initService().then(_userData => {
      if (this.authService.userCredentials.connectedAddresses) {
        let participants = this.authService.userCredentials.connectedAddresses.map(user => {
          let participant = {};
          participant["GGUID"] = user.GGUID;
          participant["displayname"] = user.firstname + " " + user.lastname;
          participant["editable"] = true;
          return participant;
        });
        this.participantOptions = participants;
      }
      this.addressService.getGroupsOfUser(this.authService.userCredentials.GGUID).subscribe(groups => {
        for (let group of groups) {
          let participant = {};
          participant["GGUID"] = group.GGUID;
          participant["displayname"] = group.name;
          participant["editable"] = true;
          this.participantOptions.push(participant);
        }
      });
    });
  }

  createMessageData(): any {
    if (this.entry.allDay || !this.startH || !this.endH) {
      //skip the else part -- this is an all day date
      let formStart = new Date(+this.startM.split("\.")[2], +this.startM.split("\.")[1] - 1, +this.startM.split("\.")[0]);
      this.entry.start = CalendarEntry.formatDateAndTime(formStart);
    }
    else {
      //manually extract date from user input
      //year, months-1, days, hours, minutes     
      let formStart = new Date(+this.startM.split("\.")[2], +this.startM.split("\.")[1] - 1, +this.startM.split("\.")[0], +this.startH.split("\:")[0], +this.startH.split("\:")[1]);
      let formEnd = new Date(+this.endM.split("\.")[2], +this.endM.split("\.")[1] - 1, +this.endM.split("\.")[0], +this.endH.split("\:")[0], +this.endH.split("\:")[1]);
      if (formEnd < formStart) {
        if (!this.alertActive) {
          this.alertActive = true;
          this.warnForInvalidDateInput();
        }
        //cancel submitting
        return null;
      }
      else {
        this.entry.start = CalendarEntry.formatDateAndTime(formStart);
        this.entry.end = CalendarEntry.formatDateAndTime(formEnd);
      }
    }
    return this.entry.convertToBackendAppointment();
  }

  onSubmit() {
    // only submit if data was changed
    if (this.hasChanged) {
      // check if data is valid
      if (!this.formControls.valid) {
        // TODO show validation hints
        return console.error('INVALID FORM DATA');
      }

      // merge new data to model
      let messageData = this.createMessageData();
      // if editing existing entry, update
      if (messageData && this.isEditing && messageData.GGUID) {
        this.onEdit(messageData);
        // create new entry
      } else if (messageData) {
        this.onCreate(messageData);
      }

      // TODO Alert if nothing has changed?
      // or only activate save button if something has changed
    } else {

    }
  }

  onEdit(messageData) {
    _paq.push(['trackEvent', 'Menu-Navigation', 'Kalender Eintrag aktualisiert']);
    // let loadingIndicator: Loading = this.createLoading('Termin wird aktualisiert');
    this.appointmentService.putAppointment(messageData).subscribe(
      () => {
        this.canLeave = true;
        // loadingIndicator.dismiss();
        this.nav.pop();
        // TODO redirect so entryDetail of updated entry
      },
      (error) => {
        console.log('Update error: ', error);
        this.canLeave = true;
        // loadingIndicator.dismiss();
        this.nav.pop();
      }
    );
  }

  onCreate(messageData) {
    _paq.push(['trackEvent', 'Menu-Navigation', 'Kalender Eintrag erstellt']);
    // let loadingIndicator: Loading = this.createLoading('Termin wird erstellt');
    this.appointmentService.postAppointment(messageData, this.authService._userCredentials.GGUID).subscribe(
      () => {
        this.canLeave = true;
        // loadingIndicator.dismiss();
        this.nav.pop();
        // TODO redirect so entryDetail of updated entry
      },
      (error) => {
        console.log('Creation error: ', error);
      }
    );
  }

  onDelete() {
    confirmAction(this.alertController,
      "Termin Löschen?",
      "Sind sie sicher?",
      () => {
        this.deleteEntry();
        _paq.push(['trackEvent', 'Menu-Navigation', 'Kalender Eintrag gelöscht']);
      }
    );
  }

  deleteEntry() {
    // let loadingIndicator: Loading = this.createLoading('Termin wird gelöscht');
    this.appointmentService.deleteAppointment(this.entry.id).subscribe(
      () => {
        this.canLeave = true;
        let lastIndex = this.nav.indexOf(this.nav.last());
        this.nav.remove(lastIndex - 1).then(() => {
          this.nav.pop();
        });
      },
      (error) => {
        console.log('Deletion error: ', error);
      }
    );
  }

  touchEndTime() {
    this.endTimeTouched = true;
  }

  //TODO: Runs when the page is about to leave and no longer be the active page.
  ionViewWillLeave() {
    // confirmBack(this.alertController, () => { this.nav.pop() });
    this.valueChangeSub.unsubscribe();
  }

  createLoading(title: string, dismissCallback?: () => void) {
    let loading: Loading = this.loading.create({
      content: title,
      dismissOnPageChange: true
    });
    // call onDidDismiss callback
    if (dismissCallback) {
      loading.onDidDismiss(() => { dismissCallback() });
    }
    loading.present();
    // this.nav.present(loading);
    return loading;
  }

  warnForInvalidDateInput() {
    let alertPopup = this.alertController.create({
      title: "Achtung",
      message: "Das von Ihnen eingegebene Enddatum des Termins liegt vor dem Startdatum. Das ist leider nicht möglich.",
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.alertActive = false;
          }
        },
      ]
    });
    alertPopup.present();
  }

  //methods required to confirm view leaving with modal window

  exitView() {
    super.confirmLeaveView(this.alertController, this.canLeave).then(_resolve => {
      this.canLeave = true;
      this.nav.pop();
    },
      _reject => {
        //do nothing
      })
  }

  leaveView() {
    super.confirmLeaveView(this.alertController, this.canLeave).then(_resolve => {
      this.canLeave = true;
      this.nav.popToRoot();
    },
      _reject => {
        //do nothing
      })
  }

  ionViewCanLeave(): Promise<void> {
    return super.confirmLeaveView(this.alertController, this.canLeave);
  }

}
