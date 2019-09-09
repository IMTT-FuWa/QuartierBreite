import { Component, Input, ElementRef } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { INavParams, IDetailNavParams } from '../../shared-interfaces/data';
import { CalendarEntryDetail } from './entryDetail';
import { NewsStreamComponentBase } from '../newsStreamComponent-base';
import { Http } from '@angular/http';

@Component({
  selector: 'sonia-news-stream-entry-pinnboard',
  template: `
        <ion-item (click)="showDetail()">
            <h2 class="sonia-news-stream-title">{{displayData.title}}</h2>
            <p>
            {{displayData.start | momentDate:"longDate" }}, {{displayData.start | momentDate:"mediumTime" }} Uhr
            </p>
            <ion-icon name="arrow-forward" item-right></ion-icon>
            <span class="sonia-news-stream-entry-marker"></span>
        </ion-item>
    `, host: {
    class: 'sonia-news-stream-entry'
  }
})
export class CalendarNewsStreamComponent extends NewsStreamComponentBase {
  /**
  * this are the main input attributes for all NewsStream components and must be provided
  **/
  @Input() public displayData;
  @Input() public navParams: INavParams;

  constructor(
    public nav: NavController,
    public http: Http,
    public el: ElementRef,
    public app: App) {
    super(nav, el, http);
  }


  showDetail() {
    if (!this.displayData.id) {
      console.error('CalendarNewsStreamComponent - Error: trying to show entry details, but entry data doesn not specify an unique id');
      return;
    }

    let params: IDetailNavParams = {
      pageData: this.navParams.pageData,
      moduleData: this.navParams.moduleData,
      params: {
        id: this.displayData.id
      }
    };
    this.app.getRootNav().push(CalendarEntryDetail, params);
  }
}
