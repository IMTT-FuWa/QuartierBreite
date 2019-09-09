import { Injectable } from '@angular/core';
import { Http, Jsonp } from '@angular/http';
import { HttpErrorHandler } from '../remote-services/error-handler-service';

/**
* we use the google feed reader api
* this service is specificly written for this service!
**/

@Injectable()
export class RssService {

  constructor(public http: Http, public jsonp: Jsonp, public errorHandler: HttpErrorHandler) { }

  /**
  * returns Observable<Response>
  * can't type that... typescript...stuff..
  **/
  getRssFeed(url, _numEntries: number = 20) {
    // let headers = new Headers();
    // headers.append('Content-Type','application/json');
    // headers.append('Accept', 'application/json');
    // headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
    // headers.append('Access-Control-Allow-Origin', '*');
    // headers.append('Access-Control-Allow-Headers', "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding");
    // let params = new URLSearchParams();    
    // let reqOptions = {
    //   url: url,
    //   search: params,
    //   headers: headers
    // };
    return this.http.get(url).map(res => res.text());
  }
}
