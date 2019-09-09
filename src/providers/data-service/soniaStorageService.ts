import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { ILocalStorageService, IDataServiceOptions } from './interfaces';
import _ from 'lodash';

@Injectable()
export class SoniaStorageService implements ILocalStorageService {

  // public localStore:NativeStorage;

  constructor(public nativeStorage: NativeStorage) {
  }

  getForType(type: string, options?: IDataServiceOptions): Promise<any> {
    type = this.replaceSpacesInPath(type);
    // we have to react to empty storage, if we start the
    // app the first time offline, so we return an empty Array
    // if the query promise rejects for a certain type
    // (i.e. the store was not populated before, but that should not be an error)

    //this if clause checks if HTML5 storage is available (browser)
    if (typeof (Storage) !== "undefined") {
      return new Promise((resolve, reject) => {
        this.getBrowser(type)
          .then(data => { resolve(this.filterDataByIds(data, options)) },
          failure => { reject(failure) });
      });
    } else {
      return new Promise((resolve, reject) => {
        this.getMobile(type)
          .then(data => { resolve(this.filterDataByIds(data, options)) },
          failure => { reject(failure) });
      });
    }
  };

  setForType(type: string, data: any, options?: IDataServiceOptions): void {
    type = this.replaceSpacesInPath(type);
    
    // if there are already entries for the given type,
    // we merge the new an the old state, so we can handle single fetched
    // entries from the backend and still provide all entries under
    // a single key

    // get current state for type
    // call getForType without truncation options to get the fullDate
    // set of current data in either case
    this.getForType(type).then(currentData => {
      // merging data sets
      if (options && options.id) {
        let mergedData = this.mergeDataByProp(currentData, data, 'id');
        this.setForTypeInternal(type, mergedData);
      } else { this.setForTypeInternal(type, data) }
    },
      // no current data, just save it
      _noCurrentData => { this.setForTypeInternal(type, data) }
    );
  }

  deleteForType(type: string, id: string): void {
    type = this.replaceSpacesInPath(type);    
    this.getForType(type).then(currentData => {
      let newData = currentData.filter((entry) => {
        return entry.id !== id;
      });
      this.setForType(type, newData);
    });
  }

  deleteAllInPath(path: string): void {
    path = this.replaceSpacesInPath(path);
    this.deleteForTypeInternal(path);
  }

  //Helper functions
  private getMobile(type: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.nativeStorage.getItem(type).then(
        (item) => {
          resolve(JSON.parse(item));
        },
        (_error) => {
          reject("item not found");
        }
      )
    })
  }

  private getBrowser(type: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let item = localStorage.getItem(type);
      if (item && item !== "undefined") {
        resolve(JSON.parse(item));
      }
      else {
        reject("item not found");
      }
    });
  }

  private filterDataByIds(data, options: IDataServiceOptions): any {
    if (options && data) {
      // filtering for ids
      if (options.id) {
        return data.filter(entry => {
          return entry.id == options.id;
        });
      }
    }
    return (data);
  }

  /**
  * warning: do not use from outside
  * internal helper method which sets a key value pair in storage
  * either mobile or browser
  * does NOT check for merging
  */
  private setForTypeInternal(type: string, data: any) {
    //this if clause checks if HTML5 storage is available (browser)
    if (typeof (Storage) !== "undefined") {
      localStorage.setItem(type, JSON.stringify(data));
    } else {
      this.nativeStorage.setItem(type, data);
    }
  }

  /**
  * warning: do not use from outside
  * internal helper method which sets a key value pair in storage
  * either mobile or browser
  * does NOT check for merging
  */
  private deleteForTypeInternal(type: string) {
    //this if clause checks if HTML5 storage is available (browser)
    if (typeof (Storage) !== "undefined") {
      localStorage.removeItem(type);
    } else {
      this.nativeStorage.remove(type);
    }
  }

  private replaceSpacesInPath(path: string){
    path = path.replace(" ", "_");
    return path;
  }

  /**
  * helper function to merge incoming data into existing data
  * @param oldData - array of entries for one type
  * @param newData - array or single object of the same type
  *
  * entries get merged by their 'id' attribute
  **/
  private mergeDataByProp(oldData: Array<any>, newData: any, prop: string): Array<any> {
    let mergeTarget: Array<any> = oldData.concat();

    if (!Array.isArray(newData) && typeof newData !== 'object') {
      console.error('SoniaStorageService - TypeError: could not merge new data. newData should be an array or object');
      return oldData;
    }

    if (!Array.isArray(newData)) {
      newData = [newData];
    }

    _.each(newData, function (newEntry) {
      var foundOldEntry = _.find(mergeTarget, function (oldEntry) {
        return oldEntry[prop] === newEntry[prop];
      });
      foundOldEntry ? _.extend(foundOldEntry, newEntry) : mergeTarget.push(newEntry);
    });

    return mergeTarget;
  }
}
