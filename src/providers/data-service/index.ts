import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import { SoniaStorageService } from './soniaStorageService';
import { IRemoteDataTypeUrls } from './interfaces';
import { IRemoteData } from '../../shared-interfaces/data';
import { ConnectivityService } from '../connectivity/index';
import { AngularFireDatabase } from 'angularfire2/database';
import { BlackboardRemoteService } from "../remote-services/blackboard-remote-service";
import { AppointmentRemoteService } from "../remote-services/appointment-remote-service";
import { CalendarEntry } from "../../modules/calendar/calendarEntry";
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs';
import { EncryptionProvider } from '../encryption/encryption';
import { AddressRemoteService } from '../remote-services/address-remote-service';
import { arrayContains } from '../../utilities/array-contains';

/**
* mapping from internal data types to remote data types
*
* TODO
* the used IRemoteDataService should override these constants
* to fit the backend api datatypes. should serve as abstraction
* for the modules using specific data types in case the
* backend api changes (i.e. an other IRemoteDataService is used)
**/
export const DATA_TYPES = {
  Blackboard: 'Blackboard',
  Calendar: 'Calendar'
}

@Injectable()
export class DataService {

  public platformReady: boolean = false;
  public dataTypes: IRemoteDataTypeUrls;

  constructor(
    public appointmentService: AppointmentRemoteService,
    public blackboardService: BlackboardRemoteService,
    public addressService: AddressRemoteService,
    public localStorageService: SoniaStorageService,
    public connection: ConnectivityService,
    public platform: Platform,
    public http: Http,
    public af: AngularFireDatabase,
    private encryptionProvider: EncryptionProvider
  ) {
    this.platform.ready().then(() => {
      this.platformReady = true;
    });
  }

  // expose available data types to use with CRUD methods
  get DATA_TYPES(): IRemoteDataTypeUrls {
    return this.dataTypes;
  }

  getBlackboardNews(GGUID: string) {
    var fetched: Observable<any>;
    var fetchObserver: Observer<any>;
    fetched = new Observable(observer => fetchObserver = observer).share();
    var entryList = [];
    if (this.connection.isOnline) {
      this.blackboardService.initTokenAndWait().then(
        _x => {
          this.blackboardService.getBlackboardNews(GGUID).subscribe(proposals => {
            for (var proposal of proposals) {
              //map for news view
              proposal["createdAt"] = proposal.timestamp;
              let blackboard = {
                title: proposal.blackboardTitle,
                GGUID: proposal.blackboardGGUID,
                role: proposal.role
              }
              proposal["blackboard"] = blackboard;
              entryList.push(proposal);
            }
            fetchObserver.next(this.wrapData(entryList, true));
          });
        }
      );
    }
    return fetched;
  }

  getCalendarNews(GGUID: string) {
    var fetched: Observable<any>;
    var fetchObserver: Observer<any>;
    fetched = new Observable(observer => fetchObserver = observer).share();
    var entryList = [];
    if (this.connection.isOnline) {
      this.appointmentService.initTokenAndWait().then(
        _x => {
          this.appointmentService.getAppointmentNews(GGUID).subscribe(appointments => {
            for (var appointment of appointments) {
              //map for news view
              let entry = new CalendarEntry(appointment);
              entryList.push(entry);
            }
            fetchObserver.next(this.wrapData(entryList, true));
          });
        }
      );
    }
    return fetched;
  }

  fetchFirebaseChatNews(user: string) {
    // we push all updates to this stream
    var fetched: Observable<any>;
    var fetchObserver: Observer<any>;
    fetched = new Observable(observer => fetchObserver = observer).share();
    // get remote data from firebase
    let chatsPromise = this.loadOneOnOneChats(user);
    // let groupsPromise = this.loadGroupChats(user);
    let chatsPromises = [chatsPromise/*, groupsPromise*/];
    Promise.all(chatsPromises).then(entryListList => {
      for (let i = 0; i <= entryListList.length; i++) {
        let entryList = entryListList[i];
        fetchObserver.next(this.wrapData(entryList, true));
        if (i == entryListList.length - 1) {
          fetchObserver.complete();
        }
      }
    });
    return fetched;
  }

  loadOneOnOneChats(user: string): Promise<any> {
    return new Promise<any>((outerResolve) => {
      if (this.connection.isOnline) {
        let chatMetaDataPromise = this.getChatMetaData(user);
        chatMetaDataPromise.then(chats => {
          let entryList = [];
          if (chats == null || chats.length == 0) {
            outerResolve(entryList);
          }
          for (const chat of chats) {
            let chatpartner = this.getChatpartner(user, chat);
            let latestMessageLoaded = new Promise<any>((innerResolve) => {
              let subscription = this.af.list("chats2/" + chat.chatId, ref => ref.orderByKey().limitToLast(1))
                .valueChanges().subscribe((message: any) => {
                  if (message && message[0] && message[0].message && message[0].sender && message[0].sender !== user && !message[0].read) {
                    let chatNewsObject = {
                      "lastMessage": this.encryptionProvider.decrypt(message[0].message, message[0].timestamp, message[0].sender),
                      "sender": user,
                      "chatId": chat.chatId,
                      "receiver": chatpartner,
                      "timestamp": message[0].timestamp,
                      //needed for the implicit sort call
                      "createdAt": message[0].timestamp
                    }
                    if (!arrayContains(entryList, chatNewsObject)) {
                      entryList.push(chatNewsObject);
                    }
                  }
                  innerResolve(subscription)
                });
            });
            latestMessageLoaded.then(subscription => {
              subscription.unsubscribe();
              if (chats.indexOf(chat) == chats.length - 1) {
                outerResolve(entryList);
              }
            });
          }
        });
      }
    });
  }

  private getChatpartner(user: string, chat: any) {
    let chatpartner = "";
    for (let participant of chat.participants) {
      if (participant !== user) {
        chatpartner = participant;
      }
    }
    return chatpartner;
  }
  private getChatMetaData(user: string): Promise<any> {
    return new Promise<any>((resolve) => {
      let chats = []
      this.af.object("users2/" + user).valueChanges().subscribe(userMetaData => {
        if (userMetaData && userMetaData["chats"]) {
          for (let chatId in userMetaData["chats"]) {
            let chat = userMetaData["chats"][chatId];
            chats.push(chat);
          }
        }
        resolve(chats);
      });
    });
  }

  logout() {
    //delete current login data from storage
    this.localStorageService.deleteAllInPath(this.dataTypes.LOGIN);
  }

  // check persitent login data
  checkLogin(): Promise<IRemoteData> {
    return new Promise((resolve, reject) => {
      return this.platform.ready().then(_x => this.localStorageService.getForType(this.dataTypes.LOGIN).then(
        loginData => { resolve(loginData) },
        noLoginData => { reject(noLoginData) }
      ))
    });
  }




  /**
  * Helper
  **/

  public wrapData(data: any, isRemoteData: boolean = false): IRemoteData {
    let wrappedData: IRemoteData = {
      meta: {
        isRemoteData: isRemoteData
      },
      data: data
    };
    return wrappedData;
  }

  public defereTillReady(fn, args): Observable<any> {
    return Observable.fromPromise(this.platform.ready())
      .flatMap(_x => fn.apply(this, args));
  }

}
