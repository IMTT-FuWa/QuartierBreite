import { Injectable } from '@angular/core';
import { NavController, Platform, Loading, LoadingController, AlertController, App } from 'ionic-angular';
import { IAppLauncherScheme } from '../../shared-interfaces/data';
import { IAppLauncherSchemeDetails } from '../../shared-interfaces/data';
import { InAppBrowserService } from '../in-app-browser/index';
import { AppAvailability } from '@ionic-native/app-availability';

/**
* quick workaround to prevent the typescript TypeError for
* cordova plugins that get added at runtime (i.e. navigator.startApp etc.)
* TODO: create declarations (or find some..somewhere..)
**/
declare let startApp;

@Injectable()
export class AppLauncherService {

  public nav: NavController;
  // the current loading instance
  private loadingIndicator: Loading;

  constructor(
    public app: App, 
    private platform: Platform, 
    private inAppBrowser: InAppBrowserService,
    private loading: LoadingController, 
    private alert: AlertController, 
    private appAvailability: AppAvailability) {
    // the NavControllers "id" is specified as ViewChild-Id on <ion-nav> in app.html
    this.nav = app.getRootNav();
  }

  launchApp(config: IAppLauncherScheme) {
    // the platform specific app identifier
    let schemeDetails: IAppLauncherSchemeDetails;
    this.loadingIndicator = this.createLoading();
    /**
    * SETUP get the platform specific configuration scheme
    * TODO: Get the proper platform schemes, i.e. platform strings
    */

    // running on IOS
    if (this.platform.is('ios') && config.iosScheme) {
      schemeDetails = config.iosScheme;
      // running on Android
    } else if (this.platform.is('android') && config.androidScheme) {
      schemeDetails = config.androidScheme;
      // running on Windows (Phones only? Or Desktop too?)
    } else if (this.platform.is('windows') && config.wpScheme) {
      // schemeDetails = config.wpScheme;
    }
    // check for errors in configuration
    if (!schemeDetails && !this.platform.is('core')) {
      throw new Error('AppLauncherService: Could not find app launch scheme for "' + config.appName + '" on this platform');
    }
    // console.log('Launching exernal App via AppLauncherService: ', config.appName);
    // console.log('Device Platform: ', this.platform.platforms());
    // console.log('Device Scheme: ', schemeDetails);

    /**
    * LAUNCH:
    */

    // just if cordova Plugin is used, i.e. on mobile Device
    if (!this.platform.is('core') && startApp) {
      // this.loadingIndicator = this.createLoading();
      if (schemeDetails.scheme.includes("||")) {
        const schemesArray = schemeDetails.scheme.split("||");
        // console.log("splitting scheme", schemesArray);
        // And append each function in the array to the promise chain
        let promise = this.checkAndStartApp(schemeDetails, config, schemesArray[0]);
        for (var i = 1; i <= schemesArray.length - 1; i++) {
          const scheme = schemesArray[i];
          // promise = promise.then(
          promise.then(
            resolve => {
              //if failed, try again
              if (resolve == "fail") {
                // console.log("app not found yet, further iteration needed");
                return this.checkAndStartApp(schemeDetails, config, scheme).catch(error => console.log("error:", error));
              }
              else if (resolve == "success") {
                //if success, cancel cascading
                return new Promise<string>(resolve => resolve("success"));
              }
            }).catch(error => { console.log("error", error) });;
        }
        //if app still was not found give download hint
        promise.then(resolve => {
          this.loadingIndicator.dismiss();
          if (resolve == "fail") {
            // console.log("app could not be found on device");
            this.createAlert(
              'Die App ' + config.appName + ' ist nicht installiert!',
              'Die App ist auf diesem Gerät nicht installiert! Bitte installieren Sie ' + config.appName + ".", schemeDetails.storeUrl)
          }
          else if (resolve == "success") {
            // console.log("app was found");
          }
        }).catch(error => console.log(error));
      }
      else {
        // console.log("starting singular app", schemeDetails);
        this.checkAndStartApp(schemeDetails, config, schemeDetails.scheme).then(resolve => {
          if (resolve == "fail") {
            // console.log("app could not be found on device");
            this.createAlert(
              'Die App ' + config.appName + ' ist nicht installiert!',
              'Die App ist auf diesem Gerät nicht installiert! Bitte installieren Sie ' + config.appName + ".", schemeDetails.storeUrl)
          }
          this.loadingIndicator.dismiss();
        }).catch(() => { });
      }
    } else {
      console.warn('AppLauncherService: cannot launch app "' + config.appName + '" in desktop browsers');
    }
  }

  checkAndStartApp(schemeDetails, config, scheme): Promise<string> {
    return new Promise<string>((resolve) => {
      // console.log("trying to start app", scheme, schemeDetails);
      this.appAvailability.check(scheme).then(
        () => {
          // console.log('App is available');

          if (this.platform.is('android')) {
            // console.log('App start android');
            let appstarter = startApp.set({ package: scheme, action: schemeDetails.intentSetAction, uri: schemeDetails.intentURI });
            appstarter.start(
              () => {
                // console.log('STARTED OK');
                //reject
                resolve("success");
              },
              () => {
                // console.log('STARTED FAIL');
                //resolve
                this.createAlertCancel(
                  'Fehler beim Start von ' + config.appName,
                  'Die App konnte nicht gestartet werden.');
                resolve("fail");
              }
            );

          } else if (this.platform.is('ios')) {
            // console.log('APP STARTED OK ON IOS');
            this.inAppBrowser.open(scheme);
            resolve("success");
          } else {
            // console.log('App started OK');
            resolve("success");
          }
        },
        () => {
          // console.log('APP IS NOT AVAILABLE');
          // this.loadingIndicator.dismiss();
          // this.createAlert(
          //   'Die App ' + config.appName + ' ist nicht installiert!',
          //   'Die App ist auf diesem Gerät nicht installiert! Bitte installieren Sie ' + config.appName + ".", schemeDetails.storeUrl);
          resolve("fail");
        }
      );
    });
  }

  createLoading() {
    let loading: Loading = this.loading.create({
      content: 'Bitte Warten, die Anwendung wird gestartet...',
      dismissOnPageChange: false
    });
    loading.present();
    return loading;
  }

  createAlert(title: string, message: string, url: string) {
    let alert = this.alert.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'installieren',
          handler: () => {
            // console.log('Agree clicked');
            this.inAppBrowser.open(url).then(
              () => { },
              (_error) => { console.log('FAILD to open in Browser') }
            );
          }
        }
      ]
    });
    alert.present();
  }

  createAlertCancel(title: string, message: string) {
    let alert = this.alert.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => { }
        }
      ]
    });
    alert.present();
  }
}
