import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavParams, NavController, LoadingController, ToastController } from 'ionic-angular';
import { ModuleBase } from '../module-base';
import { LoginRedirectService } from '../../providers/authentication/login-redirect-service';
import { CalendarImportService } from '../../providers/cal-import-export/calendarImportService';
import { arrayContains } from '../../utilities/array-contains';
import { AppointmentRemoteService } from "../../providers/remote-services/appointment-remote-service";
import { AuthenticationService } from "../../providers/authentication/authentication-service";
import { CalendarEntry } from "./calendarEntry";

/**
* All normal modules must extend ModuleBase and have to be
* decorated by @Page
**/
@Component({
  templateUrl: 'import.html'
})

export class CalendarImportModule extends ModuleBase {

  public formControls: FormGroup;
  public start: string = "";
  public end: string = "";
  public valueChangeSub;
  public appointments: Array<any> = [];


  constructor(
    public params: NavParams,
    public nav: NavController,
    public fb: FormBuilder,
    public loginRedirectService: LoginRedirectService,
    public calendarImportService: CalendarImportService,
    public authService: AuthenticationService,
    public appointmentService: AppointmentRemoteService,
    public loading: LoadingController,
    private toastCtrl: ToastController) {
    super(params, nav, loginRedirectService);

    this.formControls = this.fb.group({
      start: [this.start, Validators.compose([Validators.pattern('[0-9][0-9]\.[0-9][0-9]\.[0-9][0-9][0-9][0-9]'), Validators.required])],
      end: [this.end, Validators.compose([Validators.pattern('[0-9][0-9]\.[0-9][0-9]\.[0-9][0-9][0-9][0-9]'), Validators.required])],
    });
    this.valueChangeSub = this.formControls.valueChanges.subscribe(formData => {
      this.start = formData.start;
      this.end = formData.end;
    },
      error => {
        console.log(error);
      });

  }

  import() {
    let startDate = new Date(+this.start.split("\.")[2], +this.start.split("\.")[1] - 1, +this.start.split("\.")[0]);
    let endDate = new Date(+this.end.split("\.")[2], +this.end.split("\.")[1] - 1, +this.end.split("\.")[0]);
    let loader = this.loading.create({
      content: 'Gerätekalender wird durchsucht...',
    });

    loader.present().then(() => {
      this.calendarImportService.importDeviceAppointments(startDate, endDate).then((observable) => {
        observable.subscribe((appointment: CalendarEntry) => {
          if (!(arrayContains(this.appointments, appointment))) {
            this.appointments.push(appointment);
          }
        },
          (error) => {
            console.log(error);
          },
          () => {
            loader.dismiss();
          }
        )
      },
        (error) => {
          console.log(error);
        }
      );
    });
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Termin erfolgreich importiert',
      duration: 1500,
      position: 'top'
    });
    toast.present();
  }

  importAppointment(appointment: CalendarEntry) {
    this.appointmentService.postAppointment(appointment.convertToBackendAppointment(), this.authService._userCredentials.GGUID).subscribe(_x => {
    });
    this.presentToast();
    let index = this.appointments.indexOf(appointment);
    this.appointments.splice(index, 1);
  }

  back() {
    this.nav.pop();
  }

}
