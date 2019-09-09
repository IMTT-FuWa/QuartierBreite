import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ConfigLoaderPage } from '../pages/bootstrap-page/config-loader-page';
import { SmartAudio } from '../providers/smart-audio';

// declare var stateTree: any;

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class SoniaNetzApp {
  rootPage: any = ConfigLoaderPage;

  constructor(public platform: Platform, 
    private splashScreen: SplashScreen, 
    private smartAudio: SmartAudio) {
    platform.ready().then(() => {
      this.splashScreen.hide();
      this.smartAudio.preload('BtnClickSound', 'assets/audio/clickSound.mp3');
    });
  }
}
