import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { SoniaConfigService } from '../../providers/sonia-config-service/index';
import { ServiceInjectionPage } from "./service-injection-page";


@Component({
  templateUrl: 'config-loader-page.html'
})
export class ConfigLoaderPage {

  constructor(
    public params: NavParams,
    public soniaConfigService: SoniaConfigService,
    public nav: NavController
  ) {
    //Inject other providers
  }

  ionViewDidEnter() {
    //start bootstrap service and set new root page
    this.soniaConfigService.initConfig().then(() => { this.nav.setRoot(ServiceInjectionPage) });
    // this.soniaConfigService.initConfig().then(() => { this.nav.push(ExampleModule) });
  }

}
