import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SoniaConfigService } from "../sonia-config-service/index";
import { AuthenticationService } from "../authentication/authentication-service";
import { HttpErrorHandler } from "./error-handler-service";


@Injectable()
export class BlackboardRemoteService {

  private apiEndpoint: string;
  private type: string;
  private token: string;

  constructor(
    public http: Http,
    public authService: AuthenticationService,
    public errorHandler: HttpErrorHandler
  ) {
    this.apiEndpoint = SoniaConfigService.APP_SETTINGS['apiEndpoint'];
    this.type = "/api/blackboard";
    this.initTokenAndWait().then(_token => console.log("token found")).catch(notFound=> console.log("no token found", notFound));
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


  public getAllBoards(userGGUID: string): Observable<any> {
    let resourceUrl: string = this.apiEndpoint + this.type + "/boards/" + userGGUID + "/1/100";
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("requesting", reqOptions);
    return this.http.get(resourceUrl, reqOptions).map(response => {
      // console.log('getAllBoards: ', response.json());
      return response.json();
    }).catch(this.errorHandler.handleError);
  }

  public getUsersForBoard(boardGGUID: string): Observable<any> {
    let resourceUrl: string = this.apiEndpoint + this.type + "/permissions/" + boardGGUID;
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("requesting", reqOptions);
    return this.http.get(resourceUrl, reqOptions).map(response => {
      // console.log('getUsersForBoard: ', response.json());
      return response.json();
    }).catch(this.errorHandler.handleError);
  }

  public getEntriesForBoard(boardGGUID: string): Observable<any> {
    let resourceUrl: string = this.apiEndpoint + this.type + "/proposals/" + boardGGUID + "/1/100";
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("requesting", reqOptions);
    return this.http.get(resourceUrl, reqOptions).map(response => {
      // console.log('getEntriesForBoard: ', response.json());      
      return response.json();
    }).catch(this.errorHandler.handleError);
  }

  public getBlackboardNews(userGGUID: string): Observable<any> {
    let resourceUrl: string = this.apiEndpoint + this.type + "/news/" + userGGUID + "/5";
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("requesting", reqOptions);
    return this.http.get(resourceUrl, reqOptions).map(response => {
      // console.log('getEntriesForBoard: ', response.json());
      // response.headers.append("Access-Control-Allow-Origin", "*");
      return response.json();
    }).catch(this.errorHandler.handleError);
  }

  public getEntryDetails(proposalGGUID: string): Observable<any> {
    let resourceUrl: string = this.apiEndpoint + this.type + "/proposal/" + proposalGGUID;
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("requesting", reqOptions);
    return this.http.get(resourceUrl, reqOptions).map(response => {
      // console.log('getEntryDetails: ', response.json());
      return response.json();
    }).catch(this.errorHandler.handleError);
  }


  public linkPermission(blackboardGGUID, addressGGUID, role): Observable<any> {
    //entry mandatory fields: GGUID_USER, GGUID_BOARD, role
    let resourceUrl: string = this.apiEndpoint + this.type + "/permission/" + blackboardGGUID + "/" + addressGGUID + "/" + role;
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("posting", reqOptions);
    return this.http.post(resourceUrl, null, reqOptions).map(response => {
      // console.log('linkPermission: ', response);
      return response.status;
    }).catch(this.errorHandler.handleError);
  }

  public deletePermission(userId, permissionId) {
    let resourceUrl: string = this.apiEndpoint + this.type + "/permission/" + userId + "/" + permissionId;
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("requesting", reqOptions);
    return this.http.delete(resourceUrl, reqOptions).map(response => {
      // console.log('deleteEntry: ', response.status);
      return response.status;
    }).catch(this.errorHandler.handleError);
  }

  public createEntry(entry: any): Observable<any> {
    //entry mandatory fields: author, title, content, GGUID (of bboard)
    let resourceUrl: string = this.apiEndpoint + this.type + "/proposal/";
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("posting", reqOptions, entry);
    return this.http.post(resourceUrl, entry, reqOptions).map(response => {
      // console.log('createEntry: ', response);
      return response.text();
    }).catch(this.errorHandler.handleError);
  }

  public updateEntry(entry: any, _gguid: string): Observable<any> {
    //entry mandatory fields: author, title, content, GGUID (of bboard)
    let resourceUrl: string = this.apiEndpoint + this.type + "/proposal/";
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("putting", reqOptions, entry);
    return this.http.put(resourceUrl, entry, reqOptions).map(response => {
      // console.log('updateEntry: ', response);
      return response.text();
    }).catch(this.errorHandler.handleError);
  }

  public deleteEntry(entryGGUID: string) {
    let resourceUrl: string = this.apiEndpoint + this.type + "/proposal/" + entryGGUID;
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("requesting", reqOptions);
    return this.http.delete(resourceUrl, reqOptions).map(response => {
      // console.log('deleteEntry: ', response.status);
      return response.status;
    }).catch(this.errorHandler.handleError);
  }

}
