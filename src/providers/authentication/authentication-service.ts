import { Injectable, EventEmitter } from '@angular/core';
import { IUserCredentials } from '../../shared-interfaces/user';
import { SoniaStorageService } from "../data-service/soniaStorageService";

@Injectable()
export class AuthenticationService {

  public _isAuthenticated: boolean;
  // data as received from the backend
  // data transformed for easier access
  public _userCredentials: IUserCredentials;
  public _authenticationEmitter: EventEmitter<any>;
  public loginSuccess = false;
  public loginFailure = false;

  constructor(public storageService: SoniaStorageService) {
    this._isAuthenticated = false;
    this.initService().then((_resolve) => {
    })
  }


  saveLogin(loginData: any) {
    this.storageService.setForType("login", loginData);
    this._userCredentials = this.transformUserCredentials(loginData);
    this._isAuthenticated = true;
  }

  checkLogin(): Promise<boolean> {
    //TODO make test request to see if token is still valid
    return new Promise((resolve, _reject) => {
      this.storageService.getForType("login").then(loginData => {
        if (loginData) {
          resolve(true);
        }
        else {
          resolve(false);
        }
      })
    });
  }

  /**
   * returns user credentials if user is logged in
   * 
   * @returns {Promise<IUserCredentials>} 
   * @memberof AuthenticationService
   */
  initService(): Promise<IUserCredentials> {
    return new Promise((resolve, _reject) => {
      if (this._userCredentials && this._userCredentials.token) {
        resolve(this._userCredentials);
      }
      else {
        this.storageService.getForType("login").then(
          loginData => {
            if (loginData) {
              this._userCredentials = this.transformUserCredentials(loginData);
              this._isAuthenticated = true;
              resolve(this._userCredentials);
            }
            else {
              resolve(null);
            }
          },
          _notFound => {
            resolve(null);
          });
      }
    });
  }

  logout() {
    // this.dataService.logout();
    this.storageService.deleteAllInPath("login");
    this._isAuthenticated = false;
    this._userCredentials = null;
  }

  transformUserCredentials(rawCredentials): IUserCredentials {
    return rawCredentials;
  }

  getFullUsername(): string {
    return this._userCredentials.firstname + " " + this._userCredentials.lastname;
  }

  getToken(): string {
    return this._userCredentials.token;
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  get authChange(): EventEmitter<boolean> {
    return this._authenticationEmitter;
  }

  get userCredentials(): IUserCredentials {
    return this._userCredentials;
  }
}
