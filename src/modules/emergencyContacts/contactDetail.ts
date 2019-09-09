import { InAppBrowserService } from '../../providers/in-app-browser/index';
import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, Platform, AlertController } from 'ionic-angular';
import { ModuleBase } from '../module-base';
import { AuthenticationService } from '../../providers/authentication/authentication-service';
import { EmergencyEmailService } from '../../providers/EmailComposer/index';
import { IDetailNavParams } from '../../shared-interfaces/data'
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

// sub pages
import { CallNumber } from '@ionic-native/call-number';

/**
* All normal modules must extend ModuleBase and have to be
* decorated by @Page
**/
@Component({
  templateUrl: 'contactDetail.html'
})
export class EmergencyContactDetail extends ModuleBase implements OnInit {

  needsAuth: boolean = false;
  contact: any;
  isTabletOrIpad: any;

  constructor(
    public navParams: NavParams,
    public authService: AuthenticationService,
    public nav: NavController,
    public platform: Platform,
    public alert: AlertController,
    public emergencyEmail: EmergencyEmailService,
    public callNumber: CallNumber,
    public inAppBrowser: InAppBrowserService,
    private launchNavigator: LaunchNavigator) {
    super(navParams, nav);
    var params = this.navParams.get('params');
    //this.initializeContacts();
    this.contact = params.data.contact;
    this.contact["address"] =
      (this.contact.street ? (this.contact.street + ", ") : "") +
      (this.contact.zip ? (this.contact.zip + ", ") : "") +
      (this.contact.town ? (this.contact.town + ", ") : "") +
      (this.contact.country ? (this.contact.country + ", ") : "") +
      (this.contact.state ? (this.contact.state) : "");

    this.contact["PrivateAddress"] =
      (this.contact.street3 ? (this.contact.street3 + ", ") : "") +
      (this.contact.zip3 ? (this.contact.zip3 + ", ") : "") +
      (this.contact.town3 ? (this.contact.town3 + ", ") : "") +
      (this.contact.country3 ? (this.contact.country3 + ", ") : "") +
      (this.contact.gwstate3 ? (this.contact.gwstate3) : "");
  }

  call(number) {
    if (this.platform.is('mobile')) {
      this.callNumber.callNumber(number, true).then(
        (_success) => {
        },
        (_error) => {
          this.createAlert(
            'Fehler beim Start von Telefon',
            'Der Anruf konnte nicht ausgeführt werden!');
        });
    } else {
      this.createAlert(
        'Keine SIM-Karte',
        'Der Anruf konnte nicht ausgeführt werden, da das Gerät keine SIM-Karte besitzt.');
    }
  }

  ngOnInit() {
  }

  openContact(contact) {
    let params: IDetailNavParams = {
      pageData: this.pageData,
      moduleData: this.moduleData,
      params: {
        data: contact
      }
    };
    this.nav.push(contact, params);
  }

  sendMail(mail) {
    let emergencyEmail = {
      to: mail,
      subject: "Notmail"
    };

    this.emergencyEmail.launchEmergencyEmail(emergencyEmail);
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

  openLink(link) {
    if (!link.startsWith("http://")) {
      link = "http://" + link;
    }
    this.inAppBrowser.open(link).then(
      _ => { },
      (error) => { console.warn('ExternalBrowser: ' + error) }
    );
  }
  navigate(address) {
    let options: LaunchNavigatorOptions = {
      // app: this.launchNavigator.APP.GOOGLE_MAPS
    };
    this.launchNavigator.navigate(address, options).then(
      error => console.log('Error launching navigator', error)
    );
  }
}
