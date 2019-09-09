import { AuthenticationService } from '../providers/authentication/authentication-service';
import { LoginPage } from '../pages/login-page/index';
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { IPageData } from '../shared-interfaces/data';
import { Platform, NavController, App, AlertController } from 'ionic-angular';
import { InfoPage } from "../pages/info-page/index";
import { PassChangePage } from "../pages/pass-change/index";

@Component({
  selector: 'sonia-sub-header-bar',
  template: `
        <ion-buttons left *ngIf="!isAuthenticated && isOnline">
            <button ion-button icon-only (click)="clickLogin()"> 
                <ion-icon name="log-in"></ion-icon>
            </button>
        </ion-buttons>
        <ion-title>
            <span  *ngIf="username">Hallo {{username}}</span>
            <em class="title-small" *ngIf="!username">Nicht angemeldet</em>
        </ion-title>
        <ion-buttons right>
            <button *ngIf="isAuthenticated" icon-only ion-button (click)="onPassChangeClick()">
                <ion-icon name="person"></ion-icon>
            </button>
            <button icon-only ion-button (click)="onInfoClick()">
                <ion-icon name="information-circle"></ion-icon>
            </button>
            <button *ngIf="isAuthenticated" icon-only ion-button (click)="onLogout()">
                <ion-icon name="log-out"></ion-icon>
            </button>
        </ion-buttons>
    `,
  host: {
    class: "sonia-sub-header-bar"
  }
})

export class SubHeaderBar implements OnInit {
  nav: NavController;
  @Input() pageData: IPageData;
  @Input() isOnline: boolean;
  @Input() isAuthenticated: boolean;
  @Input() username: string;
  @Output() onGotoLogin: EventEmitter<any> = new EventEmitter();
  //pageTitle:string;

  constructor(app: App, public alert: AlertController, public platform: Platform, private authenticationService: AuthenticationService) {
    this.nav = app.getRootNav();
  }

  ngOnInit() {
    //this.pageTitle = this.pageData.pageTitle;
  }

  ngAfterViewInit() {
  }
  onInfoClick() {
    this.nav.push(InfoPage, {
      pageData: {
        pageTitle: 'Projektinformation'
      }
    });
  }

  onPassChangeClick() {
    this.nav.push(PassChangePage, {
      pageData: {
        pageTitle: 'Passwort ändern'
      }
    });
  }

  clickLogin() {
    this.onGotoLogin.emit({});
  }
  onLogout() {
    let alert = this.alert.create({
      title: 'Ausloggen',
      subTitle: 'Sie werden jetzt ausgeloggt und auf die Loginseite weitergeleitet!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.authenticationService.logout();
            this.nav.push(LoginPage, {
              pageData: {
                pageTitle: 'Anmelden'
              },
              backToHome: true
            });
          }
        }
      ]
    });
    alert.present();
  }
}
