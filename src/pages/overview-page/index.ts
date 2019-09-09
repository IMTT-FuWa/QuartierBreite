import { Component, ViewChild } from '@angular/core';
import { NavParams, NavController, AlertController, Platform, App, ViewController, IonicApp, Loading, LoadingController } from 'ionic-angular';
import { getSubStateTreeByKey, getModulesByModuleDataKey } from '../../utilities/state-tree-utils';
import { PageBase } from '../page-base';
import { LoginPage } from '../login-page/index';
import clone from 'lodash/clone';
import { AuthenticationService } from '../../providers/authentication/authentication-service';
import { SoniaConfigService } from '../../providers/sonia-config-service/index';
import { ConnectivityService } from '../../providers/connectivity/index';
import { SmartAudio } from '../../providers/smart-audio';
import { Calendar } from '../../modules/calendar/index';
import { IPageData } from '../../shared-interfaces/data';
import { NewsStreamService, NewsRegistrationAccessor } from '../../providers/news-stream/index';
import { DataService } from "../../providers/data-service/index";
import { BlackboardList } from '../../modules/blackboard/index';
import { Observable } from 'rxjs/Observable';

declare var _paq: any;

@Component({
  templateUrl: 'overview-page.html'
})
export class OverviewPage extends PageBase {

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
  public chatNewsNumber;
  public calendarNewsNumber;
  public blackboardNewsNumber;

  /**
   * News Stream Attributes
   */

  @ViewChild('listContainer') listContainer; // that's a ViewContainerRef - preventing typescript trouble -.-
  moduleRegistrations: Array<NewsRegistrationAccessor>;
  showRefresh: boolean;

  loadingIndicator: Loading;
  // set pageData for this individual page explicitly
  // TODO default this somewhere..
  pageData: IPageData = {
    pageTitle: 'Neuigkeiten',
    pageColor: 'defaultColor'
  };

  constructor(
    public navParams: NavParams,
    public nav: NavController,
    public authService: AuthenticationService,
    public dataService: DataService,
    public connectivityService: ConnectivityService,
    public alertController: AlertController,
    public app: App,
    public ionicApp: IonicApp,
    public platform: Platform,
    public viewController: ViewController,
    public newsStreamService: NewsStreamService,
    public loading: LoadingController,
    public alert: AlertController,
    private smartAudio: SmartAudio
  ) {
    super(navParams);
    //check if this is a sub page, otherwise this is the main page
    // console.log(this.nav.length());
    // console.log(navParams.get('pageData'));
    this.isHomeOverview = (this.nav.length() == 1 && !navParams.get('pageData'));
    // this.isHomeOverview = true;
    this.stateTreeBranch = this.navParams.get("stateTree");
    if (!this.stateTreeBranch) {
      // this.nav.setRoot(this);
      this.registerBackButton();
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
    // console.log("view will enter");
    this.authService.initService().then(_x => {
      if (this.authService.isAuthenticated) {
        this.isAuthenticated = true;
        this.username = this.authService.getFullUsername();
        this.preLoadNews();
        this.registerNewsStreamModules(this.newsStreamService, SoniaConfigService.STATE_TREE);
        // this.updateList();
      }
      else {
        this.isAuthenticated = false;
        this.username = null;
      }
    }).catch(_error => {
      this.isAuthenticated = false;
      this.username = null;
    });
  }

  preLoadNews() {
    if (this.isHomeOverview && this.authService.isAuthenticated) {
      this.dataService.fetchFirebaseChatNews(this.authService.getFullUsername()).subscribe(chats => {
        console.log(chats);
        this.chatNewsNumber = chats.data.length;
      });
      Calendar.getRemoteData(this.dataService, this.authService, null).subscribe(appointments => {
        // console.log("appointments found", appointments);
        this.calendarNewsNumber = appointments.data.length;
      });
      BlackboardList.getRemoteData(this.dataService, this.authService, null).subscribe(proposals =>{ 
        // console.log("proposals found", proposals);
        this.blackboardNewsNumber = proposals.data.length;
      });
    }
  }


  // TODO define interface for button configs!
  createOverviewButtonConfigs(childStates) {
    // console.log("MAPPING CHILD STATES");
    //TODO Implement Web and mobile view
    let mappedChildStates = Object.keys(childStates).map(stateKey => {
      let buttonConfig = clone(childStates[stateKey]);
      buttonConfig.stateKey = stateKey;
      // get layout config from remote files in appConfig
      buttonConfig.buttonLayout = this.getButtonLayoutConfig(stateKey);
      // get stateTree to pass on to next overview level
      buttonConfig.subStateTree = this.getSubStateTreeFor(stateKey);
      return buttonConfig;
    });
    // console.log(childStates);
    // console.log(mappedChildStates);
    if (this.platform.is("core")) {
      // console.log("CORE PLATFORM DETECTED");
      let coreMappedChildStates = [];
      for (var childState of mappedChildStates) {
        // console.log(childState);
        if (childState.page) {
          // console.log(childState.page.name);
          if (!(childState.pageData && childState.pageData.hideFromWebApp)) {
            //add in case it is a page and not a module
            coreMappedChildStates.push(childState);
          }
        }
        else if (childState.module) {
          // console.log(childState.module.name);
          if (childState.moduleData && childState.moduleData.exposeToWebApp) {
            //add in case it is a module and exposed in state tree
            coreMappedChildStates.push(childState);
          }
          else {
            //do not add if there is no module data or it is not exposed in state tree
          }
        }
      }
      return coreMappedChildStates;
    } else if (this.platform.is("ios")) {
      // console.log("iOS PLATFORM DETECTED");
      let iOSMappedChildStates = [];
      for (var childStateIOS of mappedChildStates) {
        // console.log(childStateIOS);
        if (childStateIOS.page) {
          // console.log(childStateIOS.page.name);
          if (!(childStateIOS.pageData && childStateIOS.pageData.hideFromIOS)) {
            //add in case it is a page and not a module
            iOSMappedChildStates.push(childStateIOS);
          }
        }
        else if (childStateIOS.module) {
          // console.log(childStateIOS.module.name);
          if (childStateIOS.moduleData && childStateIOS.moduleData.exposeToIOS) {
            //add in case it is a module and exposed in state tree
            iOSMappedChildStates.push(childStateIOS);
          }
          else {
            //do not add if there is no module data or it is not exposed in state tree
          }
        }
      }
      return iOSMappedChildStates;
    } else if (this.platform.is("android")) {
      // console.log("iOS PLATFORM DETECTED");
      let ANDROIDMappedChildStates = [];
      for (var childStateANDROID of mappedChildStates) {
        // console.log(childStateIOS);
        if (childStateANDROID.page) {
          // console.log(childStateIOS.page.name);
          if (!(childStateANDROID.pageData && childStateANDROID.pageData.hideFromANDROID)) {
            //add in case it is a page and not a module
            ANDROIDMappedChildStates.push(childStateANDROID);
          }
        }
        else if (childStateANDROID.module) {
          // console.log(childStateIOS.module.name);
          if (childStateANDROID.moduleData && childStateANDROID.moduleData.exposeToANDROID) {
            //add in case it is a module and exposed in state tree
            ANDROIDMappedChildStates.push(childStateANDROID);
          }
          else {
            //do not add if there is no module data or it is not exposed in state tree
          }
        }
      }
      return ANDROIDMappedChildStates;
    }
    else {
      // console.log("MOBILE PLATFORM DETECTED");
      return mappedChildStates;
    }

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


  gotoLogin() {
    this.nav.push(LoginPage, {
      pageData: {
        pageTitle: 'Anmelden'
      }
    });
  }


  registerBackButton() {
    this.platform.registerBackButtonAction(() => {
      //if there is a modal etc., dismiss it and do not pop nav      
      let activePortal = this.ionicApp._loadingPortal.getActive() ||
        this.ionicApp._modalPortal.getActive() ||
        this.ionicApp._toastPortal.getActive() ||
        this.ionicApp._overlayPortal.getActive();
      if (activePortal) {
        activePortal.dismiss();
        // console.log("handled with portal");
        return;
      }
      if (this.nav.canGoBack()) {
        _paq.push(['trackEvent', 'Menu-Navigation', 'Zurück']);
        this.nav.pop().catch(error => { console.log(error) });
      }
      else {
        let confirm = this.alertController.create({
          title: 'Beenden bestätigen',
          message: 'Möchten Sie die App beenden?',
          buttons: [
            {
              text: 'Ja, beenden.',
              handler: () => {
                _paq.push(['trackEvent', 'Menu-Navigation', 'App Beendet']);
                this.platform.exitApp();
              }
            },
            {
              text: 'Nein',
              handler: () => {
                // console.log('Disagree clicked');
              }
            }
          ]
        });
        confirm.present();
      }
    });
  }

  createLoginAlert() {
    let alert = this.alertController.create({
      title: 'Login wird benötigt',
      message: 'Um diese Funktionalität zu nutzen, müssen Sie sich anmelden.',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
            // console.log("loginRedirectService rejected");
          }
        },
        {
          text: 'Zur Anmeldung',
          handler: () => {
            // console.log("navigating to login page");
            this.nav.push(LoginPage, {
              pageData: {
                pageTitle: 'Anmelden'
              }
            }).catch(error => console.log(error));
          }
        }
      ]
    });
    alert.present();
  }


  /**
   * 
   * News Stream Methods
   * 
   */

  registerNewsStreamModules(newsStreamService: NewsStreamService, stateTree) {

    // get all module classes, and theis moduleData and pageData
    // by moduleData key:value in an object
    let moduleDefinitions = getModulesByModuleDataKey(stateTree, 'exposeToNewsStream', true);
    //  console.log("moduleDefinitions:", moduleDefinitions)
    // do additional filtering here if needed

    // tell the newsStreamService to register the appropriate callbacks
    // provided by the modules
    newsStreamService.registerModules(moduleDefinitions);
  }

  overviewSelect() {
    this.smartAudio.play('BtnClickSound');
  }

  updateListWithRedirect() {
    if (!this.isAuthenticated) {
      this.createLoginAlert();
    }
    else {
      this.updateList();
    }
  }

  updateList() {
    // console.log("update list");
    this.smartAudio.play('BtnClickSound');
    this.showRefresh = false;
    // show loader before when we start fetching and showing the news
    // TODO don't show loader, if we know, that we fetch from lokal store only
    // this.loadingIndicator = this.createLoading();

    // get the updated news entries
    this.moduleRegistrations = this.newsStreamService.getRegistrations();
    // console.log("moduleRegistrations", this.moduleRegistrations);
    // while the section components get updated, we wait for all observables
    // to resolve to then hide the loading indicator
    let observableArr = this.moduleRegistrations.map(reg => reg.data);
    Observable.forkJoin(observableArr).subscribe(
      // callback for each observable subsciption
      () => { },
      // error in any of them
      err => {
        console.error('NewsStreamPage - Error: cannot load all module data', err);
        this.showRefresh = true;
        //this.loadingIndicator.dismiss();
        this.createAlert("Fehler", "Nicht alle Neuigkeiten konnten fehlerfrei geladen werden. Bitte versuchen Sie es später erneut.");
      },
      // all completed
      () => {
        // console.log("all dates loaded, showing refresh button");
        this.showRefresh = true;
        // all news are loaded and displayed, hide loader;
        // this.loadingIndicator.dismiss();
      }
    );
  }

  createLoading() {
    let loading: Loading = this.loading.create({
      content: 'Neuigkeiten werden geladen...',
      dismissOnPageChange: true
    });
    loading.present();
    return loading;
  }

  createAlert(title: string, message: string) {
    let alert = this.alert.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
            // TODO - propper error handling
            // i.e. navigate back, if none of the news loaded
          }
        }
      ]
    });
    alert.present();
  }

}