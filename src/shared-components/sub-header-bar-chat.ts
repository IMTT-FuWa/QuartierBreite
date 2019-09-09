import { Component, Input, OnInit } from '@angular/core';
import { IPageData } from '../shared-interfaces/data';
import { ConnectivityService } from '../providers/connectivity/index';

@Component({
  selector: 'sonia-sub-header-bar-chat',
  template: `
  <ion-buttons left>
    <ion-title>
        <span  *ngIf="receiver">Chat mit {{receiver}}</span>
        <em class="title-small" *ngIf="!receiver">Nicht angemeldet</em>
    </ion-title>
    </ion-buttons>
    <ion-buttons right>
    <div class="offline" *ngIf="!isOnline()">
        <span><em>Sie sind Offline</em></span>
    </div>
    </ion-buttons>
    `,
  host: {
    class: "sonia-sub-header-bar-chat"
  }
})

export class SubHeaderBarChat implements OnInit {
  @Input() pageData: IPageData;
  @Input() receiver: string;
  // @Input() username:string;

  constructor(public connection: ConnectivityService) { }

  isOnline(): boolean {
    return this.connection.isOnline;
  }

  ngOnInit() {
    //this.pageTitle = this.pageData.pageTitle;
  }

  ngAfterViewInit() {

  }
}
