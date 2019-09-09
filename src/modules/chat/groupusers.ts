import {AddressRemoteService} from '../../providers/remote-services/address-remote-service';
//ionic/angular
import { Component } from '@angular/core';
import { NavParams, NavController, ModalController, AlertController } from 'ionic-angular';
import { ModuleBase } from '../module-base';

//services
import { AuthenticationService } from '../../providers/authentication/authentication-service';

import { AddGroupUserModal } from "./addGroupUserModal";

@Component({
  templateUrl: 'groupusers.html',
})
export class GroupUsers extends ModuleBase {

  // private blackboard: any;
  private admins: any[];
  private members: any[];
  private groupGGUID: string;
  private role: string;

  constructor(public navParams: NavParams,
    public nav: NavController,
    public authService: AuthenticationService,
    public addressService: AddressRemoteService,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController
  ) {
    super(navParams, nav);
    var params = this.navParams.get('params');
    this.groupGGUID = params.data.groupGGUID;
    this.role = params.data.role;
  }

  ionViewWillEnter() {
    this.loadUsers();
  }


  loadUsers() {
    this.admins = [];
    this.members = [];
     this.addressService.resolveGroup(this.groupGGUID).subscribe(groupMembers=>{
        for(var member of groupMembers){
          if (member.role == "ADD_GRPADMIN"){
            this.admins.push(member);
          }
          else{
            this.members.push(member);
          }
        }
     });
  }

  openModal() {
    let boardModal = this.modalCtrl.create(AddGroupUserModal, {groupGGUID: this.groupGGUID});
    boardModal.onDidDismiss((_data) => {
        this.loadUsers();
    });
    boardModal.present();
  }

  removeUser(user){
        let alertPopup = this.alertCtrl.create({
        title: "Nutzer entfernen",
        message: "Möchten Sie diesen Nutzer wirklich aus der Gruppe entfernen?",
        buttons: [
          {
            text: 'Ja',
            handler: () => {
              this.addressService.removeGroupMember(user.linkGGUID, this.groupGGUID).subscribe(_result=>{
                this.loadUsers();
              });
            }
          },
          {
            text: 'Nein',
            handler: () => {
              //dismiss
            }
          }
        ]
      });
      alertPopup.present();
  }

  hasModRights() {
    return this.role == "ADD_GRPADMIN";
  }

  goBack() {
    this.nav.pop();
  }


}
