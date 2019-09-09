import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Injectable()
export class InAppBrowserService {

  options: string;

  constructor(public platform: Platform, public inAppBrowser: InAppBrowser) {
    // default options - TODO make this configurable
    this.options = "location=yes,clearcache=yes,toolbar=yes,closebuttonscaption=yes";
  }

  open(url) {
    return this.platform.ready().then(() => {
      return new Promise((resolve, reject) => {
        if (url && url !== "") {
          // check if running on mobile device
          let browser = this.inAppBrowser.create(url, "_system");
          if (this.platform.is('mobile')) {
            //InAppBrowser.open;
            browser.on("loaderror").subscribe(
              (_evt) => {
                reject('InAppBrowserService - could not open external browser window for url ' + url);
              }
            );
          } else {
            //InAppBrowser.open;
          }
          resolve(browser);
        } else {
          reject('InAppBrowserService: URL was not specified')
        }
      });
    });
  }
}
