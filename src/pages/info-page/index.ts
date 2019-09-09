import { Component } from '@angular/core';
import { App, NavParams, NavController, Platform } from 'ionic-angular';
import { PageBase } from '../page-base';
import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowserService } from '../../providers/in-app-browser/index';


declare var _paq: any;

@Component({
  templateUrl: 'info-page.html'
})

export class InfoPage extends PageBase {

  rootNav;
  versionNumber = 'unknown';
  appName = 'unknown';
  versionCode = 'unknown';
  linkHFU = "http://www.hs-furtwangen.de/";
  linkGAW = "http://www.ez-gaw.de/";
  linkKST = "http://www.keppler-stiftung.de/";
  linkIAO = "https://www.iao.fraunhofer.de/lang-de/";
  linkBW = "https://sozialministerium.baden-wuerttemberg.de/de/startseite/";

  constructor(params: NavParams,
    public app: App,
    public nav: NavController,
    public platform: Platform,
    public inAppBrowser: InAppBrowserService,
    public appVersion: AppVersion
  ) {
    super(params);
    this.rootNav = app.getRootNav();

    if (this.platform.is('android') || this.platform.is('ios')) {
      this.appVersion.getVersionNumber().then((s) => {
        this.versionNumber = s;
      })
      this.appVersion.getAppName().then((p) => {
        this.appName = p;
      })
      this.appVersion.getVersionCode().then((t) => {
        this.versionCode = t;
      })
    }

  }

  ionViewWillEnter() {
    _paq.push(['trackPageView', 'InfoPage']);
  }

  openLink(link) {
    this.inAppBrowser.open(link).then(
      _ => { },
      (error) => { console.warn('ExternalBrowser: ' + error) }
    );
  }

}
