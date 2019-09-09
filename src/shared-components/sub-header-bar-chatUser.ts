import { Component, Input, OnInit } from '@angular/core';
import { IPageData } from '../shared-interfaces/data';

@Component({
  selector: 'sonia-sub-header-bar-chatUser',
  template: `
    <ion-title>
        <span  *ngIf="ownUser">Angemeldet als {{ownUser}}</span>
        <em class="title-small" *ngIf="!ownUser">Nicht angemeldet</em>
    </ion-title>
    `,
  host: {
    class: "sonia-sub-header-bar-chatUser"
  }
})

export class SubHeaderBarChatUser implements OnInit {
  @Input() pageData: IPageData;
  @Input() ownUser: string;

  constructor() {

  }

  ngOnInit() {
    //this.pageTitle = this.pageData.pageTitle;
  }

  ngAfterViewInit() {

  }
}
