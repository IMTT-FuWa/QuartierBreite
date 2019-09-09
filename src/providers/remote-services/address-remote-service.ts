import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SoniaConfigService } from "../sonia-config-service/index";
import { AuthenticationService } from "../authentication/authentication-service";
import { HttpErrorHandler } from "./error-handler-service";

@Injectable()
export class AddressRemoteService {

  private apiEndpoint: string;
  private type: string;
  private token: string;

  constructor(
    public http: Http,
    public authService: AuthenticationService,
    public errorHandler: HttpErrorHandler

  ) {
    this.apiEndpoint = SoniaConfigService.APP_SETTINGS['apiEndpoint'];
    this.type = "/api/address";
    this.initTokenAndWait().then(_token =>
      console.log("token found")).catch(notFound => console.log("no token found", notFound));
  }

  public initTokenAndWait(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.authService.initService().then(userData => {
        // console.log("authService init");
        if (userData) {
          this.token = userData.token;
          resolve();
        }
        else {
          // console.log("warning no login found");
          reject();
        }
      }).catch(error => {
        reject();
        console.log("no login found", error);
      });
    });
  }

  private getHeadersWithToken(): Headers {
    let headers = new Headers();
    headers.append("X-AuthToken", this.token);
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    return headers;
  }

  public getAllUsers(): Observable<any> {
    let resourceUrl: string = this.apiEndpoint + this.type;
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    console.log(this.token);
    // console.log("requesting", reqOptions);
    return this.http.get(resourceUrl, reqOptions).map(response => {
      // console.log('getAllUsers: ', response.json());
      return response.json();
    }).catch(this.errorHandler.handleError);
  }


  public getQuartierContacts(): Observable<any> {
    let resourceUrl: string = this.apiEndpoint + this.type + "/quartier";
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("requesting", reqOptions);
    return this.http.get(resourceUrl, reqOptions).map(response => {
      // console.log('getAllUsers: ', response.json());
      return response.json();
    }).catch(this.errorHandler.handleError);
  }

  public getGroupsOfUser(userGGUID: string): Observable<any> {
    let resourceUrl: string = this.apiEndpoint + this.type + "/" + userGGUID + "/groups";
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("requesting", reqOptions);
    return this.http.get(resourceUrl, reqOptions).map(response => {
      // console.log('getGroupsOfUser: ', response.json());
      return response.json();
    }).catch(this.errorHandler.handleError);
  }

  public resolveGroup(groupGGUID: string): Observable<any> {
    let resourceUrl: string = this.apiEndpoint + this.type + "/group/" + groupGGUID;
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("requesting", reqOptions);
    return this.http.get(resourceUrl, reqOptions).map(response => {
      // console.log('resolveGroup: ', response.json());
      return response.json();
    }).catch(this.errorHandler.handleError);
  }

  public getResources(userGGUID: string): Observable<any> {
    let resourceUrl: string = this.apiEndpoint + "/api/resources/" + userGGUID;
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("requesting", reqOptions);
    return this.http.get(resourceUrl, reqOptions).map(response => {
      // console.log('getGroupsOfUser: ', response.json());
      return response.json();
    }).catch(this.errorHandler.handleError);
  }

  /**
   * Create group object with optional members in the backend
   * 
   * @param {string} groupName : can be any string
   * @param {any} memberArray : must be [{GGUID: xxx, role: yyy},...], with roles ADD_GRPADMIN, ADD_GRPMEMBER
   * @returns {Observable<any>} 
   * @memberof AddressRemoteService
   */
  public postGroup(groupName: string, memberArray): Observable<any> {
    let body = {
      name: groupName,
      members: memberArray
    }
    let resourceUrl: string = this.apiEndpoint + this.type + "/group/";
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("requesting", reqOptions);
    return this.http.post(resourceUrl, body, reqOptions).map(response => {
      // console.log('postGroup: ', response.text());
      return response.text();
    }).catch(this.errorHandler.handleError);
  }

  /**
   * add a member to a group
   * 
   * @param {string} memberGGUID the members GGUID
   * @param {string} role ADD_GRPADMIN, ADD_GRPMEMBER
   * @param {any} groupGGUID the groups GGUID
   * @returns ok, or error
   * @memberof AddressRemoteService
   */
  public addGroupMember(memberGGUID: string, role: string, groupGGUID) {
    let body = {
      GGUID: memberGGUID,
      role: role
    }
    let resourceUrl: string = this.apiEndpoint + this.type + "/group/" + groupGGUID + "/addmember";
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("requesting", reqOptions);
    return this.http.post(resourceUrl, body, reqOptions).map(response => {
      // console.log('addGroupMember: ', response.status);
      return response.status;
    }).catch(this.errorHandler.handleError);
  }

  /**
   * remove a member from a group
   * 
   * @param {string} linkGGUID the GGUID of the link between member and group
   * @param {string} groupGGUID the groups GGUID
   * @returns 
   * @memberof AddressRemoteService
   */
  public removeGroupMember(linkGGUID: string, groupGGUID: string) {
    let resourceUrl: string = this.apiEndpoint + this.type + "/group/" + groupGGUID + "/removemember/" + linkGGUID;
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("requesting", reqOptions);
    return this.http.delete(resourceUrl, reqOptions).map(response => {
      // console.log('removeGroupMember: ', response.status);
      return response.status;
    }).catch(this.errorHandler.handleError);
  }

  /**
   * completely deletes a group and all its links in the backend
   * 
   * @param {string} groupGGUID the groups GGUID
   * @returns 
   * @memberof AddressRemoteService
   */
  public deleteGroup(groupGGUID: string) {
    let resourceUrl: string = this.apiEndpoint + this.type + "/group/" + groupGGUID;
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("requesting", reqOptions);
    return this.http.delete(resourceUrl, reqOptions).map(response => {
      // console.log('deleteGroup: ', response.status);
      return response.status;
    }).catch(this.errorHandler.handleError);
  }

}
