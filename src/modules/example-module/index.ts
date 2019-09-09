/****************************************************
*
* This Module serves as an example for all @Page modules
*
*****************************************************/

/**
* minimal necessary imports
**/
import { Component } from '@angular/core';
import { NavParams, AlertController, NavController } from 'ionic-angular';
import { ModuleBase } from '../module-base';
import { LoginRedirectService } from '../../providers/authentication/login-redirect-service';

/**
* All normal modules must extend ModuleBase and have to be
* decorated by @Page
**/
@Component({
  templateUrl: 'example-module.html'
})
export class ExampleModule extends ModuleBase {

  /**
  * modules can specify, if auth is needed to use it
  * the parent class handles this. if auth is needed an user is not logged in,
  * he will be prompted to do so (via Alert) or cancel the usage
  **/

  /**
  * this is the necessarey signature for each module constructor and its super callback
  * NavParams and ApplicationRef habe to be passed to the parent class,
  * so it can resolve all needed Dependencies/Services..
  *
  * additional injections can be made on module level, of course!
  **/
  constructor(
    public loginRedirectService: LoginRedirectService,
    public alertController: AlertController,
    public navController: NavController,
    public params: NavParams
  ) {
    super(params, navController, loginRedirectService);

  }

  ionViewWillEnter() {
  }

}
