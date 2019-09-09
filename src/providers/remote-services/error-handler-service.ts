import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/Observable/ErrorObservable';

@Injectable()
export class HttpErrorHandler {
    public handleError(error: any): ErrorObservable {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error('Http Request Error:', errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}