import { NavParams, NavController, AlertController } from 'ionic-angular';
import { IModuleData } from '../shared-interfaces/data';
import { PageBase } from '../pages/page-base';
import { LoginRedirectService } from '../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../providers/connectivity/index';

/**
* Base Class for @Page modules
**/
export class ModuleBase extends PageBase {

  moduleData: IModuleData;
  public needsAuth: boolean = true;
  public needsConfirmToLeave = false;
  // public isOnline: boolean;

  /**
  **/
  constructor(
    public params: NavParams,
    public navController?: NavController,
    public loginRedirectService?: LoginRedirectService
  ) {
    // calls PageBase constructor
    super(params);
    this.moduleData = params.get('moduleData');
    // register connectivity observer
    // this.isOnline = this.connectivityService.isOnline;
    // this.connectivityService.connectivityChange.subscribe(evt => {
    //   this.isOnline = this.connectivityService.isOnline;
    // })
  }

  isOnline(ConnectivityService: ConnectivityService): boolean {
    if (ConnectivityService) {
      return ConnectivityService.isOnline;
    }
    return false;
  }

  /**
  * Better than the above method since it is triggered before entering the view
  */
  ionViewCanEnter(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.loginRedirectService) {
        if (this.loginRedirectService.redirectRequired(this.needsAuth)) {
          // TODO auth not valid, require login
          return this.loginRedirectService.confirmRedirect(this.navController, false).then(_x => {
            reject();
          },
            _y => {
              reject();
            });
        }
        else {
          resolve();
        }
      }
      else {
        resolve();
      }
    });
  }

  confirmLeaveView(alertController: AlertController, canLeave: boolean): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (canLeave) {
        resolve();
      }
      else {
        let confirm = alertController.create({
          title: 'Möchten Sie den Vorgang wirklich abbrechen?',
          message: 'Ihre Änderungen gehen dann verloren.',
          buttons: [{
            text: 'Ja, Vorgang abbrechen.',
            handler: () => {
              resolve();
            },
          }, {
            text: 'Nein',
            handler: () => {
              reject();
            }
          }],
        });
        confirm.present();
      }
    })
  }

  /**
  * proxy method to be used by child classed
  * the callback fn will just be called, if the device is online
  * otherwise an Alert will be displayed with infos
  **/
  ensureIsOnline(alertController: AlertController, connectivityService: ConnectivityService, ensured: Function, alertDismissCallback?: Function) {
    if (this.isOnline(connectivityService)) {
      ensured();
    } else {
      let alert = alertController.create({
        title: 'Sie sind Offline!',
        message: 'Um diese Funktionalität zu nutzen, müssen Sie online sein.',
        buttons: [
          {
            text: 'Abbrechen',
            role: 'cancel',
            handler: () => {
              alertDismissCallback && alertDismissCallback();
            }
          }
        ]
      });
      alert.present();
    }
  }
}

/**
* Base Class for external modules
* these modules don't need page transitions, but must implement
* runExternal() to run their logic
**/
export abstract class ExternalModuleBase {

  public moduleData: IModuleData;
  public needsAuth: boolean = false;
  public isOnline: boolean = true;



  constructor(public loginRedirect: LoginRedirectService,
    public connectivityService: ConnectivityService,
    public alert?: AlertController,
    public navController?: NavController) {
    // register connectivity observer
    if (connectivityService) {
      this.isOnline = this.connectivityService.isOnline;
    }
    this.connectivityService.connectivityChange.subscribe(_evt => {
      this.isOnline = this.connectivityService.isOnline;
    })
  }

  run(params: NavParams) {
    this.moduleData = params.get('moduleData');
    if (this.loginRedirect.redirectRequired(this.needsAuth)) {
      this.loginRedirect.confirmRedirect(this.navController, false);
    } else {
      this.runExternal();
    }
  }

  /**
  * proxy method to be used by child classed
  * the callback fn will just be called, if the device is online
  * otherwise an Alert will be displayed with infos
  **/
  ensureIsOnline(ensured: Function) {
    if (this.isOnline) {
      ensured();
    } else {
      let alert = this.alert.create({
        title: 'Sie sind Offline!',
        message: 'Um diese Funktionalität zu nutzen, müssen Sie online sein.',
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

  /**
  * main function for execution of external module's logic
  **/
  abstract runExternal()
}
