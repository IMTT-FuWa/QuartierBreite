import { Injectable } from '@angular/core';
import { NavController, Loading, App, LoadingController, AlertController } from 'ionic-angular';
import { IEmergencyEmail } from '../../shared-interfaces/data';
import { EmailComposer } from '@ionic-native/email-composer';

@Injectable()
export class EmergencyEmailService {
  // the current loading instance
  loadingIndicator: Loading;
  nav: NavController;

  constructor(
    public loading: LoadingController, app: App, public alert: AlertController, public emailComposer: EmailComposer) {
    this.nav = app.getRootNav();
  }

  launchEmergencyEmail(config: IEmergencyEmail) {
    this.loadingIndicator = this.createLoading();
    let emergencyEmail = {
      to: config.to,
      cc: config.cc,
      bcc: config.bcc,
      attachments: [],
      subject: config.subject,
      body: config.body,
      isHtml: false
    };

    this.emailComposer.isAvailable().then(
      // success
      (_available: boolean) => {
        this.emailComposer.open(emergencyEmail).then(
          (_success) => {
            this.loadingIndicator.dismiss();
          },
          (_error) => {
            this.loadingIndicator.dismiss();
          }
        )
      }, (_error) => {
        this.loadingIndicator.dismiss();
        this.createAlert(
          'Fehler beim Start von Emailapp',
          'Die App konnte nicht gestartet werden. Bitte konfigurieren Sie ihre Mailapp');
      });
  }
  launchEmail() {
  }

  createLoading() {
    let loading: Loading = this.loading.create({
      content: 'Bitte Warten, die Anwendung wird gestartet...',
      dismissOnPageChange: false
    });
    loading.present();
    return loading;
  }

  createAlert(title: string, message: string) {
    let alert = this.alert.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => { }
        }
      ]
    });
    alert.present();
  }
}
