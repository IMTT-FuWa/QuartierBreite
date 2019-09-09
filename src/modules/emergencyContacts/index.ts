//ionic/angular
import { Component } from '@angular/core';
import { NavParams, NavController, AlertController } from 'ionic-angular';
import { ModuleBase } from '../module-base';
import { IDetailNavParams } from '../../shared-interfaces/data';
//services
import { AuthenticationService } from '../../providers/authentication/authentication-service';
import { ConnectivityService } from '../../providers/connectivity/index';
import { LoginRedirectService } from '../../providers/authentication/login-redirect-service';
import { AddressRemoteService } from '../../providers/remote-services/address-remote-service';

// sub pages
import { EmergencyContactDetail } from './contactDetail';


@Component({
  templateUrl: 'contactList.html',
})
export class Contact extends ModuleBase {

  private contacts: any;
  private allContacts: any;
  public loadingData: boolean = true;

  constructor(public navParams: NavParams,
    public nav: NavController,
    public alertController: AlertController,
    public authService: AuthenticationService,
    public conn: ConnectivityService,
    public loginRedirectService: LoginRedirectService,
    public addressService: AddressRemoteService
  ) {
    super(navParams, nav, loginRedirectService);
    //this.contact = params.data;
  }

  ionViewCanEnter(): Promise<void> {
    return super.ionViewCanEnter();
  }

  loadContacts() {
    this.contacts = [];
    this.addressService.getQuartierContacts().subscribe(quartierContacts => {
      this.contacts = quartierContacts;
      this.loadingData = false;
    });
  }

  ionViewWillLeave() {
  }

  ionViewWillEnter() {
    this.loadContacts();
  }

  ionViewDidEnter() {

  }

  getContacts(ev: any) {
    if (!this.allContacts) {
      this.allContacts = this.contacts;
    }
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.contacts = this.allContacts.filter((contact) => {
        let name = "";
        if (contact.firstname && contact.lastname) {
          name = contact.firstname + " " + contact.lastname;
        }
        else if (contact.organisationName) {
          name = contact.organisationName;
        }
        return (name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
    else {
      this.contacts = this.allContacts;
      this.allContacts = null;
    }
  }

  goToDetail(contact) {
    let params: IDetailNavParams = {
      pageData: this.pageData,
      moduleData: this.moduleData,
      params: {
        data: {
          contact: contact
        }
      }
    };
    this.nav.push(EmergencyContactDetail, params);
  }
}
