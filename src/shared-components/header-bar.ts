import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IPageData } from '../shared-interfaces/data';
import { Platform } from 'ionic-angular';
import { SmartAudio } from '../providers/smart-audio';

declare var _paq: any;

/**
* NOTE: in current ionic-angular beta there still is an issue wie content
* projection from custom components in ion-navbar like we use it here
* watch out for this issue:
* https://github.com/driftyco/ionic/issues/6004
* --> TODO
**/
@Component({
  selector: 'sonia-header-bar',
  template: `
        <ion-title left>
            {{pageTitle}}
        </ion-title>
        <!-- <div *ngIf="!platform.is('mobile')">
          {{myDate | momentDate:"mediumDate" }}
        </div> -->
        <ion-buttons end *ngIf="platform.is('android') || platform.is('ios') || platform.is('core')">
            <button ion-button color="light" *ngIf="!platform.is('mobile')">{{myDate | momentDate:"mediumDate" }}</button>
            <button ion-button icon-only color="light" *ngIf="!isHome && !pageData.hideHomeButton" (click)="onHomeBtnClick()">
                <ion-icon name="home"></ion-icon>
            </button>
        </ion-buttons>
    `
})

export class HeaderBar implements OnInit {
  @Input() pageData: IPageData;
  @Input() isHome: boolean = false;
  @Input() needsConfirmToLeave: boolean = false;
  @Output() leaveViewEmitter: EventEmitter<Object> = new EventEmitter();

  pageTitle: string;
  myDate;

  constructor(public nav: NavController, public platform: Platform, private smartAudio: SmartAudio) {
    this.myDate = new Date().toISOString();
  }

  ngOnInit() {
    this.pageTitle = this.pageData.pageTitle;
  }

  onHomeBtnClick() {
    this.smartAudio.play('BtnClickSound');
    _paq.push(['trackEvent', 'Menu-Navigation', "Home"]);
    // we pop from rootnav always to use tabs on individual pages
    if (!this.needsConfirmToLeave) {
      this.nav.popToRoot();
    }
    else {
      this.leaveViewEmitter.emit("leave");
    }
  }
}
