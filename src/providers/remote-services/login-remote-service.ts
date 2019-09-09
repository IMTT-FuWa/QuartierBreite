import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/Observable/ErrorObservable';
import { SoniaConfigService } from '../../providers/sonia-config-service/index';
import { AuthenticationService } from "../authentication/authentication-service";
import { HttpErrorHandler } from "./error-handler-service";


@Injectable()
export class LoginRemoteService {

    private apiEndpoint: string;
    public className: string;
    private token: string;

    constructor(
        public platform: Platform,
        public http: Http,
        public authService: AuthenticationService,
        public errorHandler: HttpErrorHandler
    ) {
        this.apiEndpoint = SoniaConfigService.APP_SETTINGS['apiEndpoint'];
        this.className = "LoginRemoteService";
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
                    console.log("warning no login found");
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


    b64EncodeUnicode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (_match, p1) {
            let character = parseInt('0x' + p1, 16);
            return String.fromCharCode(character);
        }));
    }

    login(username: string, password: string): Observable<any> {
        let resourceUrl = this.apiEndpoint + "/sonialogin";
        let headers = new Headers();
        headers.append("Authorization", "Basic " + this.b64EncodeUnicode(username + ":" + password));
        headers.append("Content-Type", "application/json; charset=UTF-8");
        let reqOptions = {
            url: resourceUrl,
            headers: headers
        };

        return this.http.post(resourceUrl, null, reqOptions).map(response => {
            return response.json();
        }).catch(this.handleError);
    };


    public changePassword(newPass: string): Observable<any> {
        let resourceUrl = this.apiEndpoint + "/api/user/password";
        let reqOptions = {
            url: resourceUrl,
            headers: this.getHeadersWithToken()
        };

        return this.http.put(resourceUrl, { password: newPass }, reqOptions).map(response => {
            return response.text();
        }).catch(this.handleError);
        //TODO implement    
    }


    public handleError(error: any): ErrorObservable {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error('Http Request Error:', errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
