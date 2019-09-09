//ionic/angular
import { Component } from '@angular/core';
import { NavParams, NavController, ModalController, AlertController } from 'ionic-angular';
import { ModuleBase } from '../module-base';

//services
import { AuthenticationService } from '../../providers/authentication/authentication-service';

import { BlackboardUserModal } from "./modal";
import { BlackboardRemoteService } from "../../providers/remote-services/blackboard-remote-service";

@Component({
  templateUrl: 'boardusers.html',
})
export class BoardUsers extends ModuleBase {

  private blackboard: any;
  private editors: any[];
  private admins: any[];
  private mods: any[];
  private subs: any[];
  public user: any;
  public loadingData: boolean = true;

  constructor(public navParams: NavParams,
    public nav: NavController,
    public authService: AuthenticationService,
    public blackboardService: BlackboardRemoteService,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController
  ) {
    super(navParams, nav);
    var params = this.navParams.get('params');
    this.blackboard = params.data;
  }

  loadUsers() {
    this.admins = [];
    this.mods = [];
    this.subs = [];
    this.editors = [];
    this.blackboardService.getUsersForBoard(this.blackboard.GGUID).subscribe(users => {
      for (var user of users) {
        if (user.role == "ADD_ADMIN") {
          this.admins.push(user);

        }
        if (user.role == "ADD_MODERATOR") {
          this.mods.push(user);

        }
        if (user.role == "ADD_SUBSCRIBER") {
          this.subs.push(user);
        }
        if (user.role == "ADD_EDITOR") {
          this.editors.push(user);

        }
      }
      this.loadingData = false;
    });
  }

  openModal() {
    let boardModal = this.modalCtrl.create(BlackboardUserModal, { blackboardGGUID: this.blackboard.GGUID });
    boardModal.onDidDismiss((_data) => {
      this.loadUsers();
    });
    boardModal.present();
  }

  deletePermission(permission) {
    if (permission.permissionGGUID) {
      let alertPopup = this.alertCtrl.create({
        title: "Nutzer entfernen",
        message: "Möchten Sie diesen Nutzer wirklich aus der Gruppe entfernen?",
        buttons: [
          {
            text: 'Ja',
            handler: () => {
              this.blackboardService.deletePermission(permission.userGGUID, permission.permissionGGUID).subscribe(_x => {
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
    } else {
      let alertPopup = this.alertCtrl.create({
        title: "Löschen der Berechtigung nicht möglich",
        message: "Dieser Nutzer hat seine Rechte über eine Gruppe verliehen bekommen, Sie müssen ihn über das Backend löschen",
        buttons: [
          {
            text: 'OK',
            handler: () => {
            }
          },
        ]
      });
      alertPopup.present();
    }
  }

  linkPermission(user, role) {
    this.blackboardService.linkPermission(this.blackboard.GGUID, user.GGUID, role).subscribe(_x => {
    });
  }

  hasModRights() {
    return this.blackboard.role == "ADD_ADMIN";
  }

  goBack() {
    this.nav.pop();
  }

  ionViewWillEnter() {
    this.loadUsers();
    this.user = this.authService.getFullUsername();
  }

}
