import { Observable } from "rxjs/Observable";

export interface ILocalStorageService {
    getForType(type: string, options?: IDataServiceOptions): Promise<any>;
    setForType(type: string, data: any, options?: IDataServiceOptions): void;
    deleteForType(type: string, id: string, options?: IDataServiceOptions): void;
}

export interface IRemoteDataService {
    fetch(type: string, options?: IDataServiceOptions): Observable<any>;
    create(type: string, data: any, options?: IDataServiceOptions): Observable<any>;
    update(type: string, id: string, data: any, options?: IDataServiceOptions): Observable<any>;
    delete(type: string, id: string, options?: IDataServiceOptions): Observable<any>;
    login(username: string, password: string, options?: IDataServiceOptions): Observable<any>;
    getRemoteDataTypeUrls(): IRemoteDataTypeUrls;
}

/**
* interface for option-objects passed to methods of DataService
* and/or remoteDataService
**/
export interface IDataServiceOptions {
    id?: string; // id of the entry
    userGGUID?: string; // user unique id for filtering results by user
}

/**
* interface that maps internal data types to backend urls
* IRemoteDataServices define their own set of urls, which get used
* by the dataservice itself to set remote contents in the local storage
**/
export interface IRemoteDataTypeUrls {
    LOGIN: string;
    CONTACT: string;
    APPOINTMENT: string;
}
