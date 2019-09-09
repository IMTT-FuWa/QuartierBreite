import { Component, OnInit } from '@angular/core';
import { Platform, NavParams, NavController, AlertController } from 'ionic-angular';
import { ModuleBase } from '../module-base';
import { AuthenticationService } from '../../providers/authentication/authentication-service';
import { INavParams, IDetailNavParams } from '../../shared-interfaces/data';
import { ConnectivityService } from '../../providers/connectivity/index';
import { LoginRedirectService } from '../../providers/authentication/login-redirect-service';
import { CalendarImportService } from '../../providers/cal-import-export/calendarImportService';
import { confirmAction } from '../../utilities/ConfirmActionAlert';

// sub pages
import { ResourceCalendarEditEntry } from './resourceCalendarEditEntry';
// list page
import { ResourceCalendar } from './index';
import { AppointmentRemoteService } from "../../providers/remote-services/appointment-remote-service";
import { ResourceCalendarEntry } from "./resourceCalendarEntry";

declare var _paq: any;

/**
* All normal modules must extend ModuleBase and have to be
* decorated by @Page
**/
@Component({
  templateUrl: 'resourceCalendarEntryDetail.html'
})
export class ResourceCalendarEntryDetail extends ModuleBase implements OnInit {

  needsAuth: boolean = false;
  entryParams: any;
  entry: any;

  constructor(
    public params: NavParams,
    public authService: AuthenticationService,
    public nav: NavController,
    public alertController: AlertController,
    public connectivityService: ConnectivityService,
    public loginRedirectService: LoginRedirectService,
    public calendarImportService: CalendarImportService,
    public appointmentService: AppointmentRemoteService,
    public platform: Platform
  ) {
    super(params, nav, loginRedirectService);

    this.entryParams = params.get('params');

    if (!this.entryParams) {
      console.warn('CalendarEntryDetail: There are no params to specify which Entry should be loaded to detail page');
    }
  }

  // we fetch the data, everytime the view is visited, so it stays up to date after local changes
  ionViewDidEnter() {
    _paq.push(['trackPageView', 'Kalender Eintrag Details']);
    this.appointmentService.getAppointment(this.entryParams.id).subscribe(appointment => {
      this.entry = new ResourceCalendarEntry(appointment);
      if (this.entry.participants) {
        for (let participant of this.entry.participants) {
          if (participant.displayname == "unbenannt") {
            participant.displayname = this.entryParams.data.entry.group;
          }
        }
      }
    });
  }

  // OLD: before fetch in ionViewDidEnter we did it on init
  ngOnInit() {

  }

  gotoEdit() {
    this.ensureIsOnline(this.alertController, this.connectivityService, _ => {
      let params: IDetailNavParams = {
        pageData: this.pageData,
        moduleData: this.moduleData,
        params: {
          data: { entry: this.entry, selectedResource: this.entryParams.data.selectedResource }
        }
      };
      this.nav.push(ResourceCalendarEditEntry, params);
    });
  }

  goToList() {
    let params: INavParams = {
      pageData: this.pageData,
      moduleData: this.moduleData
    };
    this.nav.push(ResourceCalendar, params);
  }

  isMyEntry() {
    if (this.entry && this.authService) {
      if (this.entry.klient && this.authService.userCredentials) {
        if (this.entry.klient.GGUID && this.authService.userCredentials.GGUID) {
          return this.entry.klient.GGUID == this.authService.userCredentials.GGUID;
        }
      }
      else return false;
    }
    return false;
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
    this.appointmentService.deleteAppointment(this.entry.id).subscribe(
      () => {
        this.nav.pop();
      },
      (error) => {
        console.log('Deletion error: ', error);
      }
    );
  }

  adminIsClient() {
    //if client is not defined, appointed was created by admin on backend
    if (this.entry.klient) {
      return false;
    }
    else {
      return true;
    }
  }

}
