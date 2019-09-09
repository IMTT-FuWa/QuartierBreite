import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SoniaConfigService } from "../sonia-config-service/index";
import { AuthenticationService } from "../authentication/authentication-service";
import { HttpErrorHandler } from "./error-handler-service";

@Injectable()
export class AppointmentRemoteService {

  private apiEndpoint: string;
  public type: string;
  private token: string;

  constructor(
    public http: Http,
    public authService: AuthenticationService,
    public errorHandler: HttpErrorHandler

  ) {
    this.apiEndpoint = SoniaConfigService.APP_SETTINGS['apiEndpoint'];
    this.type = "/appointment";
    this.initTokenAndWait().then(_token => console.log("token found")).catch(notFound => console.log("no token found", notFound));
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


  public getAppointmentsOfUser(userGGUID): Observable<any> {
    let resourceUrl: string = this.apiEndpoint + "/api/appointments/" + userGGUID;
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("requesting", reqOptions);
    return this.http.get(resourceUrl, reqOptions).map(response => {
      // console.log('getAppointmentsOfUser: ', response.json());
      return response.json();
    }).catch(this.errorHandler.handleError);
  }

  public getAppointmentsByResource(resourceGGUID): Observable<any> {
    let resourceUrl: string = this.apiEndpoint + "/api/appointments/resource/" + resourceGGUID;
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("requesting", reqOptions);
    return this.http.get(resourceUrl, reqOptions).map(response => {
      // console.log('getAppointmentsOfUser: ', response.json());
      return response.json();
    }).catch(this.errorHandler.handleError);
  }


  public getAppointmentConflictsOfResources(resourceGGUID: string, startInterval: string, endInterval: string): Observable<any> {
    let resourceUrl: string = this.apiEndpoint + 
    "/api/appointments/resource/"+resourceGGUID+"/conflicts" + 
    "?interval-start=" + startInterval + "&interval-end=" + endInterval;
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("requesting", reqOptions);
    return this.http.get(resourceUrl, reqOptions).map(response => {
      // console.log('getAppointmentsOfUser: ', response.json());
      return response.json();
    }).catch(this.errorHandler.handleError);
  }


  public getAppointment(appointmentGGUID): Observable<any> {
    let resourceUrl: string = this.apiEndpoint + "/api/appointment/" + appointmentGGUID;
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("requesting", reqOptions);
    return this.http.get(resourceUrl, reqOptions).map(response => {
      // console.log('getAppointment: ', response.json());
      return response.json();
    }).catch(this.errorHandler.handleError);
  }

  public getAppointmentNews(userGGUID): Observable<any> {
    let resourceUrl: string = this.apiEndpoint + "/api/appointment/news/" + userGGUID + "/5";
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("getAppointmentNews request", reqOptions);
    return this.http.get(resourceUrl, reqOptions).map(response => {
      // console.log('getAppointmentNews response: ', response.json());
      return response.json();
    }).catch(this.errorHandler.handleError);
  }

  public postAppointment(appointment, userGGUID): Observable<any> {
    let resourceUrl: string = this.apiEndpoint + "/api/appointment/" + userGGUID;
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    return this.http.post(resourceUrl, appointment, reqOptions).map(response => {
      // console.log('postAppointment response', response);
      return response.text();
    }).catch(this.errorHandler.handleError);
  }

  public putAppointment(appointment): Observable<any> {
    let resourceUrl: string = this.apiEndpoint + "/api/appointment/";
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    return this.http.put(resourceUrl, appointment, reqOptions).map(response => {
      // console.log('putAppointment response', response);
      return response.text();
    }).catch(this.errorHandler.handleError);
  }

  public deleteAppointment(appointmentGGUID): Observable<any> {
    let resourceUrl: string = this.apiEndpoint + "/api/appointment/" + appointmentGGUID;
    let params = new URLSearchParams();
    let reqOptions = {
      url: resourceUrl,
      search: params,
      headers: this.getHeadersWithToken()
    };
    // console.log("deleteAppointment request", reqOptions);
    return this.http.delete(resourceUrl, reqOptions).map(response => {
      // console.log('deleteAppointment response', response);
      return response.text();
    }).catch(this.errorHandler.handleError);
  }
}
