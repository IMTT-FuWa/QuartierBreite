import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { ModuleBase } from '../module-base';
import { RssService } from '../../providers/rss/index';
import { InAppBrowserService } from '../../providers/in-app-browser/index';
import { ConnectivityService } from '../../providers/connectivity/index';
import * as xml2js from "xml2js";


/**
* All normal modules must extend ModuleBase and have to be
* decorated by @Page
**/
@Component({
  templateUrl: 'rss-feed.html'
})

export class RssFeed extends ModuleBase {

  needsAuth: boolean = false;

  loadingIndicator: Loading;
  // these are objects... but i don't want to declare all properties for typescript..
  feed: any;
  entries: any[];

  constructor(
    public params: NavParams,
    public nav?: NavController,
    public inAppBrowser?: InAppBrowserService,
    public loading?: LoadingController,
    public rssService?: RssService,
    public alertController?: AlertController,
    public conn?: ConnectivityService
  ) {
    super(params);
  }

  ionViewWillEnter() {
    // show loader before when we start fetching and showing the news
    // TODO don't show loader, if we know, that we fetch from lokal store only
    this.loadingIndicator = this.createLoading();
  }

  ionViewDidEnter() {

    this.ensureIsOnline(this.alertController, this.conn, () => {
      // executed when online
      this.rssService.getRssFeed(this.moduleData.rssUrl).subscribe(
        feed => {
          var self = this;
          xml2js.parseString(feed, function (_err, result) {
            var items = result.rss.channel[0].item;
            let newItems = items.map(item => {
              Object.keys(item).map(function (key, _index) {
                item[key] = item[key][0];
              });
              // let newItem = item.map(x => {
              //   let y = {};
              //   y["title"] = item.title[0];
              //   y["link"] = item.link[0];
              //   y["description"] = item.description[0];
              //   y["category"] = item.category[0];
              //   y["pubDate"] = item.pubDate[0];
              //   y["guid"] = item.guid[0];
              //   return y;
              // });
              // create Date object for publishedDate to be used by a Date Pipe in the template
              // entry.publishedDate = new Date(entry.publishedDate);
              return item;
            });
            self.entries = newItems;
            // this.loadingIndicator.dismiss();
          });
        },
        error => {
          console.error('RssFeed - Error: cannot load new rss feed data for ' + this.moduleData.rssUrl + '. ', error);
          this.loadingIndicator.dismiss();
          this.createAlert("Fehler", "Die aktuellen Zeitungsartikel konnten nicht geladen werden. Bitte versuchen Sie es später erneut.");
        }
      );

    },
      // executed as offline alert dismiss callback
      () => {
        this.nav.pop().then(() => {
          this.nav.pop();
        });
      });

  }

  browse(entry) {
    let url = entry.link;
    this.inAppBrowser.open(url).then(
      () => { },
      (error) => { console.warn('RssFeed - Open Link in Feed ' + this.feed.title + ' : ' + error) }
    );
  }

  createLoading() {
    let loading: Loading = this.loading.create({
      content: 'Neuigkeiten werden geladen...',
      dismissOnPageChange: true
    });
    loading.present();
    // this.nav.present(loading);

    return loading;
  }

  createAlert(title: string, message: string) {
    let alert = this.alertController.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
            // return to parent page after error
            this.nav.pop().then(() => {
              this.nav.pop();
            });
          }
        }
      ]
    });
    alert.present();
    //this.nav.present(alert);
  }
}
