import { Component } from '@angular/core';
import { NavParams, NavController, AlertController, Platform, App, ViewController, IonicApp, LoadingController } from 'ionic-angular';
import { getSubStateTreeByKey } from '../../utilities/state-tree-utils';
import { PageBase } from '../../pages/page-base';
import clone from 'lodash/clone';
import { AuthenticationService } from '../../providers/authentication/authentication-service';
import { SoniaConfigService } from '../../providers/sonia-config-service/index';
import { ConnectivityService } from '../../providers/connectivity/index';
import { IPageData } from '../../shared-interfaces/data';

@Component({
  templateUrl: 'blackboards-overview.html'
})
export class BlackboardsOverview extends PageBase {

  public needsAuth: boolean = true;
  private mode: string = "overview";

  // part of the state tree this overview page will display buttons for
  // stateTreeBranch: any;
  // button config object from appConfig
  buttonConfig: any;
  // array of config objects to create overview buttons
  overviewButtonConfigs: any[];
  stateTreeBranch: any
  public isHomeOverview: boolean;

  isAuthenticated: boolean = false;
  isOnline: boolean = false;
  username: string = '';


  pageData: IPageData = {
    pageTitle: 'Neuigkeiten',
    pageColor: 'defaultColor'
  };

  constructor(
    public navParams: NavParams,
    public nav: NavController,
    public authService: AuthenticationService,
    public connectivityService: ConnectivityService,
    public alertController: AlertController,
    public app: App,
    public ionicApp: IonicApp,
    public platform: Platform,
    public viewController: ViewController,
    public loading: LoadingController,
    public alert: AlertController) {
    super(navParams);
    //check if this is a sub page, otherwise this is the main page
    this.isHomeOverview = (this.nav.length() == 1 && !navParams.get('pageData'));
    // this.isHomeOverview = true;
    this.stateTreeBranch = this.navParams.get("stateTree");
    if (!this.stateTreeBranch) {
      // this.nav.setRoot(this);
      this.stateTreeBranch = SoniaConfigService.STATE_TREE.home;
    }
    this.pageData = this.stateTreeBranch.pageData;
    this.isOnline = this.connectivityService.isOnline;
    this.isAuthenticated = this.authService.isAuthenticated;
    this.username = this.isAuthenticated ? this.authService.userCredentials.firstname : '';
    // create config objects for all overview buttons on this page
    if (this.stateTreeBranch.children) {
      this.overviewButtonConfigs = this.createOverviewButtonConfigs(this.stateTreeBranch.children);
    }
    // subscribe to online and authentication emitters
    this.connectivityService.connectivityChange.subscribe((isOnline: boolean) => {
      this.isOnline = isOnline;
    });
    //remove unused warning, since we use it in UI only
    this.mode = this.mode;
  }

  ionViewWillEnter() {

  }

  // TODO define interface for button configs!
  createOverviewButtonConfigs(childStates) {
    return Object.keys(childStates).map(stateKey => {
      let buttonConfig = clone(childStates[stateKey]);
      buttonConfig.stateKey = stateKey;
      // get layout config from remote files in appConfig
      buttonConfig.buttonLayout = this.getButtonLayoutConfig(stateKey);
      // get stateTree to pass on to next overview level
      buttonConfig.subStateTree = this.getSubStateTreeFor(stateKey);
      return buttonConfig;
    });
  }

  // seach OVERVIEW_BUTTON_CONFIG array for button styles (set in json files) by state key of button
  getButtonLayoutConfig(stateKey) {
    var buttonConf;
    for (let currentConf of SoniaConfigService.OVERVIEW_BUTTON_CONFIG) {
      buttonConf = currentConf[stateKey];
      if (buttonConf != null) {
        break;
      }
    }
    return buttonConf;
  }

  // get the state tree beginning at 'stateKey'. this must me unique or just the first match is returned
  getSubStateTreeFor(stateKey) {
    return getSubStateTreeByKey(stateKey, this.stateTreeBranch.children);
  }

}