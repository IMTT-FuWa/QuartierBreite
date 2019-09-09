import { Component, Input, ElementRef } from '@angular/core';
import { NavController, App } from 'ionic-angular';

import { INavParams, IDetailNavParams } from '../../shared-interfaces/data';
import { BlackboardEntryDetail } from './entryDetail';

import { NewsStreamComponentBase } from '../newsStreamComponent-base';
import { Http } from '@angular/http';


@Component({
  selector: 'sonia-news-stream-entry-pinnboard',
  template: `
  <ion-item (click)="showDetail()">
      <h2 class="sonia-news-stream-title">{{displayData.title}}</h2>
      <h2>Schwarzes Brett: {{displayData.blackboard.title}}</h2>
      <p>
      {{displayData.timestamp | momentDate:"longDateTimezone" }}, {{displayData.timestamp | momentDate:"mediumTimeTimezone" }} Uhr
      </p>
      <ion-icon name="arrow-forward" item-right></ion-icon>
      <span class="sonia-news-stream-entry-marker"></span>
  </ion-item>
    `,
  host: {
    class: 'sonia-news-stream-entry'
  }
})
export class BlackboardNewsStreamComponent extends NewsStreamComponentBase {
  /**
  * this are the main input attributes for all NewsStream components and must be provided
  **/
  @Input() displayData;
  @Input() navParams: INavParams;

  //for some reason we have to manually inject here... thanks ionic/angular
  constructor(public nav: NavController, public el: ElementRef, public http: Http, public app: App) {
    super(nav, el, http);
  }

  showDetail() {
    let params: IDetailNavParams = {
      pageData: this.navParams.pageData,
      moduleData: this.navParams.moduleData,
      params: {
        data: {
          blackboard: this.displayData.blackboard,
          post: this.displayData,
        }
      }
    };
    this.app.getRootNav().push(BlackboardEntryDetail, params);
  }
}
