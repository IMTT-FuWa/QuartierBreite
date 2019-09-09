import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import { SoniaStorageService } from './soniaStorageService';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs';

@Injectable()
export class FirebaseDataService {

  constructor(
    public localStorageService: SoniaStorageService,
    public platform: Platform,
    public http: Http,
    public af: AngularFireDatabase
  ) {
    //injections
  }

  //load data from local first, then from firebase
  getAsObject(path: string): Observable<any> {
    // we push all updates to this stream
    let fetched: Observable<any>;
    let fetchObserver: Observer<any>;
    fetched = new Observable(observer => fetchObserver = observer).share();
    //get from local storage
    let fromLocalStorageObservable = this.localStorageService.getForType(path);
    fromLocalStorageObservable.then(data => {
      var localDataObject = { "data": data, "local": true };
      fetchObserver.next(localDataObject);
    }, _error => {
      // fetchObserver.error(new Error('DataService - fetch: local fetch failed for type: ' + type));
    });
    // get from firebase remote
    var fromRemoteObservable = this.af.object(path).snapshotChanges().map(action => {
      const $key = action.payload.key;
      const data = { $key, ...action.payload.val() };
      return data;
    }).subscribe(data => {
      var remoteDataObject = { "data": data, "local": false };
      fetchObserver.next(remoteDataObject);
      fetchObserver.complete();
    });
    //automatically unsubscribe firebase after 3 seconds to prevent resource leaks
    setTimeout(() => {
      fromRemoteObservable.unsubscribe();
    }, 3000);
    return fetched;
  }

  //load data from local first, then from firebase
  getAsArray(path: string): Observable<any> {
    // we push all updates to this stream
    let fetched: Observable<any>;
    let fetchObserver: Observer<any>;
    fetched = new Observable(observer => fetchObserver = observer).share();
    //get from local storage
    let fromLocalStorageObservable = this.localStorageService.getForType(path);
    fromLocalStorageObservable.then(data => {
      var arrayData = this.flatMap(data);
      var localDataObject = { "data": arrayData, "local": true };
      fetchObserver.next(localDataObject);
    }, _error => {
      // fetchObserver.error(new Error('DataService - fetch: local fetch failed for type: ' + type));
    });
    // get from firebase remote
    var fromRemoteObservable = this.af.object(path).snapshotChanges().map(action => {
      const $key = action.payload.key;
      const data = { $key, ...action.payload.val() };
      return data;
    }).subscribe(data => {
      delete data.$key;
      delete data.$exists;
      var arrayData = this.flatMap(data);
      var remoteDataObject = { "data": arrayData, "local": false };
      fetchObserver.next(remoteDataObject);
      fetchObserver.complete();
    });
    //automatically unsubscribe firebase after 3 seconds to prevent resource leaks
    setTimeout(() => {
      fromRemoteObservable.unsubscribe();
    }, 3000);
    return fetched;
  }

  save(): Observable<any> {
    let create: Observable<any>;
    let createObserver: Observer<any>;
    create = new Observable(observer => createObserver = observer).share();
    //TODO implement
    return create;
  };

  append(): Observable<any> {
    let append: Observable<any>;
    let appendObserver: Observer<any>;
    append = new Observable(observer => appendObserver = observer).share();
    //TODO implement
    return append;
  };

  update(): Observable<any> {
    let update: Observable<any>;
    let updateObserver: Observer<any>;
    update = new Observable(observer => updateObserver = observer).share();
    //TODO implement
    return update;
  };

  deleteAllInPath(path: string): Observable<any> {
    let deleted: Observable<any>;
    let deletedObserver: Observer<any>;
    deleted = new Observable(observer => deletedObserver = observer).share();
    //TODO implement
    this.localStorageService.deleteAllInPath(path);
    this.af.object(path).remove();
    return deleted;
  };

  //Helper
  flatMap(json_data: any): Array<any> {
    var result = [];
    for (var property in json_data) {
      let object = {};
      object["data"] = json_data[property];
      object["$key"] = property;
      result.push(object);
    }
    return result;
  }

}
