import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { OverviewPage } from '../overview-page/index';
// import { SoniaServiceProvider } from '../../providers/sonia-service-provider';


@Component({
  templateUrl: 'service-injection-page.html'
})
export class ServiceInjectionPage {


  constructor(
    public params: NavParams,
    // public soniaServiceProvider: SoniaServiceProvider,
    public nav: NavController
  ) {
    //Inject SoniaServiceProvider
  }

  ionViewDidEnter() {
    //start service injection and set new root page afterwards
    // this.soniaServiceProvider.waitForServiceInjection().then(() => {
    //   this.nav.setRoot(OverviewPage);
    // });
    this.nav.setRoot(OverviewPage);
  }



}
