import { DataService } from '../providers/data-service';
import { Observable } from 'rxjs/Observable';

export interface IExposeToNewsStream {
    new(): any;
    getRemoteData(dataService: DataService): Observable<any>;
    getNewsStreamComponent(): any;
}
