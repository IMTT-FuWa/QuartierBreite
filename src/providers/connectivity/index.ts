import { Injectable, EventEmitter } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs/Subscription';

// == deprecated
export const CONNECTION_STATUS = {
  online: "connectivity_online",
  offline: "connectivity_offline"
}

@Injectable()
export class ConnectivityService {

  public connectSubscription: Subscription;
  public disconnectSubscription: Subscription;
  public connectivityEmitter: EventEmitter<any>;

  // toggle this for debuggin offline functionality
  public DEBUG_OFFLINE: boolean = false;
  // toggle this to force online behaviour for mock data
  public DEBUG_MOCK_ONLINE: boolean = false;

  constructor(public platform: Platform, public network: Network) {
    this.connectivityEmitter = new EventEmitter();

    this.platform.ready().then(() => {
      // TODO unsubscribe..if appropriate
      this.connectSubscription = this.network.onConnect().subscribe(_x => {
        if (!this.DEBUG_OFFLINE) {
          this.connectivityEmitter.emit(CONNECTION_STATUS.online);
          this.connectivityEmitter.emit(true);
        }
      });
      this.disconnectSubscription = this.network.onDisconnect().subscribe(_x => {
        if (!this.DEBUG_OFFLINE) {
          this.connectivityEmitter.emit(CONNECTION_STATUS.offline);
          this.connectivityEmitter.emit(false);
        }
      });
      if (this.DEBUG_OFFLINE) {
      }
      if (this.DEBUG_MOCK_ONLINE) {
      }
    });
  }

  public onConnected() {

  }

  public onDisconnected() {

  }

  public _isOnline(): boolean {
    if (this.platform.is('mobile')) {
      if (this.network.type == "none") {
        return false;
      }
      return true;
      // return true;
    } else {
      return navigator.onLine;
    }
  }

  /**
  * reveal the current online statusChange
  **/
  get isOnline(): boolean {
    if (this.DEBUG_OFFLINE) {
      return false;
    }
    if (this.DEBUG_MOCK_ONLINE) {
      return true
    }
    return this._isOnline();
  }

  /**
  * return an emitter (Observable), that can be subscribed to
  * the subscription hander recieves the current CONNECTION_STATUS
  * if the connectivity changes
  **/
  get connectivityChange(): EventEmitter<boolean> {
    return this.connectivityEmitter;
  }
}
