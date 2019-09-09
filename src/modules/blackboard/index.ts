import { Component } from '@angular/core';
import { NavParams, NavController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { ModuleBase } from '../module-base';
import { INavParams, IDetailNavParams, IRemoteData } from '../../shared-interfaces/data';
import { DataService } from '../../providers/data-service/index';
import { AuthenticationService } from '../../providers/authentication/authentication-service';
import { LoginRedirectService } from '../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../providers/connectivity/index';

// sub pages
import { BlackboardCreateEntry } from './createEntry';
import { Blackboard } from './blackboard';

// newsStream Component
import { BlackboardNewsStreamComponent } from './newsStreamComponent';

import { BlackboardRemoteService } from "../../providers/remote-services/blackboard-remote-service";
import { Observable } from 'rxjs/Observable';
// import { AddressRemoteService } from "../../providers/remote-services/address-remote-service";

/**
* All normal modules must extend ModuleBase and have to be
* decorated by @Page
**/
@Component({
  templateUrl: 'blackboardList.html'
})
export class BlackboardList extends ModuleBase {
  needsAuth: boolean = true;
  entries: Array<any>;
  loadingData: boolean = true;
  public blackboards: any[];
  // private styles =  {"color": "#ffffff", "background-color": "#f1511b"};
  // private layout = {name: "Planer", id: "", type: "", icon: "clipboard", _comment: "Planer"};

  constructor(
    public params: NavParams,
    public nav: NavController,
    public loading: LoadingController,
    public connectivityService: ConnectivityService,
    public alertController: AlertController,
    public loginRedirectService: LoginRedirectService,
    public platform: Platform,
    public blackboardService: BlackboardRemoteService,
    public authService: AuthenticationService,
    // public addressService: AddressRemoteService
  ) {
    super(params, nav, loginRedirectService);
  }

  // ionViewCanEnter(): Promise<void> {
  // return super.ionViewCanEnter();
  // }

  blackboardsContains(otherBlackboard) {
    for (var board of this.blackboards) {
      if (otherBlackboard.title == board.title) {
        return true;
      }
    }
    return false;
  }

  ionViewWillEnter() {
    this.blackboards = [];
    this.blackboardService.initTokenAndWait().then(
      _x => {
        this.getBoardsFor(this.authService._userCredentials.GGUID);
      }
    );
  }


  getBoardsFor(GGUID) {
    this.blackboardService.getAllBoards(GGUID).subscribe(boards => {
      for (var board of boards) {
        if (!this.blackboardsContains(board)) {
          this.blackboards.push(board);
        }
      }
      this.blackboards.sort(function (a, b) {
        var nameA = a.title.toLowerCase(), nameB = b.title.toLowerCase();
        if (nameA < nameB) { //sort string ascending
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0; //default return value (no sorting)
      });
      this.loadingData = false;
    });
  }

  openBlackboard(blackboard) {
    let params: IDetailNavParams = {
      pageData: this.pageData,
      moduleData: this.moduleData,
      params: {
        data: blackboard
      }
    };
    this.nav.push(Blackboard, params);
  }

  gotoCreate() {
    this.ensureIsOnline(this.alertController, this.connectivityService, _ => {
      let params: INavParams = {
        pageData: this.pageData,
        moduleData: this.moduleData
      };
      this.nav.push(BlackboardCreateEntry, params);
    });
  }

  /*******************
  * NewsStream interface
  *
  * these two methods must be implemented as static in order to register for
  * the NewsStreamService
  ********************/

  /**
  * responsible for querying remote data from the DataService
  * use this as single access point to the DataService - set up the modules query logic here
  *
  * @returns Observable<any> - so this module and the NewsStreamService can subscribe to it
  **/
  public static getRemoteData(dataService: DataService, authService: AuthenticationService, _navParams: INavParams): Observable<IRemoteData> {
    return dataService.getBlackboardNews(authService._userCredentials.GGUID);
  }

  /**
  * @returns Component for single Entries of this modules data in the NewsStreamPage
          Component must expose attribute "displayData" as @Input
  **/
  public static getNewsStreamComponent() {
    return BlackboardNewsStreamComponent;
  }
}
