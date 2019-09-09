import { Component, ViewChild } from '@angular/core';
import { Content, AlertController, ModalController, NavParams, NavController, Platform } from 'ionic-angular';
import { ModuleBase } from '../module-base';
import { INavParams, IDetailNavParams, IRemoteData } from '../../shared-interfaces/data';

//services
import { AuthenticationService } from '../../providers/authentication/authentication-service';
import { DataService } from '../../providers/data-service/index';
import { SoniaStorageService } from '../../providers/data-service/soniaStorageService';
import { LoginRedirectService } from '../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../providers/connectivity/index';

//chat
import { ChatDataPath } from './objects/chatDataPath';
import { ChatUserList } from './objects/chatUserList';
import { ChatUser } from './objects/chatUser';
import { ChatUtils } from './util/chatUtils';
import { ChatNewsStreamComponent } from './newsStreamComponent';
import { Chat } from './chat';

import { AngularFireDatabase } from 'angularfire2/database';
import { AddressRemoteService } from "../../providers/remote-services/address-remote-service";
import { CreateGroupModal } from './createGroupModal';
import { Observable } from 'rxjs/Observable';
import { EncryptionProvider } from '../../providers/encryption/encryption';

declare var _paq: any;

@Component({
  templateUrl: 'users.html'
})
export class ChatOverviewModule extends ModuleBase {

  public ownUser: string;
  public otherUsers: any;
  public groups: Array<any>;
  public subsList: Array<any>;
  public needsAuth: boolean = true;
  //types required for querying operations
  public chatDataPath: ChatDataPath;
  public chatMode = "Einzelchat";
  private allUsers: any;
  private allGroups: any;
  public loadingData: boolean = true;
  @ViewChild(Content) content: Content;


  constructor(public navParams: NavParams,
    public nav: NavController,
    public authService: AuthenticationService,
    public af: AngularFireDatabase,
    public soniaStorageService: SoniaStorageService,
    public loginRedirectService: LoginRedirectService,
    public connectivityService: ConnectivityService,
    public platform: Platform,
    public addressService: AddressRemoteService,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private encryptionProvider: EncryptionProvider
  ) {
    super(navParams, nav, loginRedirectService);
    this.chatDataPath = new ChatDataPath();
    this.otherUsers = [];
    this.groups = [];
    this.subsList = [];
    //manually initialize service, injection doesnt work here
    authService.initService().then(loggedIn => {
      if (loggedIn) {
        this.ownUser = this.authService.getFullUsername();
      }
    });
  }

  ionViewCanEnter(): Promise<void> {
    return super.ionViewCanEnter();
  }

  /**
  * register user if not registered and subscribe to user steam to get other users
  **/
  ionViewWillEnter() {
    this.content.resize();
    //register own login as user if it does not exist yet
    _paq.push(['trackPageView', 'Chat']);
    if (this.isOnline()) {
      //this.changeUsersScheme();
      //this.changeChatsScheme();
      this.registerUser();
      this.addressService.initTokenAndWait().then(
        _ => {
          //get users from nubedian backend and latest chat messages from firebase
          this.loadUsersAndLastMessages();
          //get groups from nubedian backend
          this.getBackendGroups();
        })
        .catch(_ => {
          console.log("error: token could not be loaded");
          console.log(_);
        });
    }
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Herzlich Willkommen zum Chat!',
      subTitle: 'Hier können Sie mit den anderen Nutzer der App schreiben.',
      buttons: ['OK']
    });
    alert.present();
  }

  registerUser() {
    this.af.object(this.chatDataPath.USERS + this.ownUser + "/name").set(this.ownUser);
  }


  getUsers(ev: any) {
    if (!this.allUsers) {
      this.allUsers = this.otherUsers;
    }
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.otherUsers = this.allUsers.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    else {
      this.otherUsers = this.allUsers;
      this.allUsers = null;
    }
  }

  changeChatsScheme() {
    let once = false;
    this.af.object(this.chatDataPath.CHATS).valueChanges().subscribe(chats => {
      if (!once) {
        once = true;
        for (let oldChatName in chats as any) {
          if (oldChatName.includes(",")) {
            let firstUser = oldChatName.split(",")[0];
            let secondUser = oldChatName.split(",")[1];
            let chatId = ChatUtils.uuidv4();
            let chat = {
              chatId: chatId,
              participants: [firstUser, secondUser]
            };
            this.af.list(this.chatDataPath.USERS + firstUser + "/chats/").push(chat);
            this.af.list(this.chatDataPath.USERS + secondUser + "/chats/").push(chat);
            //update chat name
            let chatObj = chats[oldChatName];
            this.af.object(this.chatDataPath.CHATS + oldChatName).remove();
            this.af.object(this.chatDataPath.CHATS + chatId).set(chatObj);
          }
        }
      }
    });
  }



  changeUsersScheme() {
    this.addressService.getAllUsers().subscribe(users => {
      for (let user of users) {
        if (user.firstname && user.lastname) {
          this.af.object(this.chatDataPath.USERS + user.firstname + " " + user.lastname + "/name").set(user.firstname + " " + user.lastname);
        }
      }
    });
  }

  loadUsersAndLastMessages() {
    //load users from nubedian middleware
    let usersLoaded = new Promise((resolve) => this.addressService.getAllUsers().subscribe(users => {
      for (let user of users) {
        if (user.firstname && user.lastname) {
          this.af.object(this.chatDataPath.USERS + user.firstname + " " + user.lastname + "/name").set(user.firstname + " " + user.lastname);
          let chatuser = new ChatUser(user.firstname + " " + user.lastname);
          if (!this.userArrayContains(this.otherUsers, chatuser) && chatuser.name !== this.ownUser) {
            this.otherUsers.push(chatuser);
          }
        }
      }
      resolve();
    }));
    usersLoaded.then(_ => {
      this.loadLatestMessages();
    });
  }

  loadLatestMessages() {
    let outerSubscription = this.af.object(this.chatDataPath.USERS + this.ownUser).valueChanges().subscribe(userMetaData => {
      let chats = userMetaData["chats"];
      if (chats != null) {
        for (let chatId in chats) {
          let chat = chats[chatId];
          let chatpartner = "";
          for (let participant of chat.participants) {
            if (participant !== this.ownUser) {
              chatpartner = participant;
            }
          }
          let subscription = this.af.list(this.chatDataPath.CHATS + chat.chatId,
            ref => ref.orderByKey().limitToLast(1))
            .valueChanges().subscribe((data: any) => {
              if (data) {
                let userExistsInBackend = this.otherUsers.filter((foundUser: { name: any; }) => foundUser.name == chatpartner);
                if (userExistsInBackend.length > 0) {
                  if (data[0] && data[0].message && data[0].sender) {
                    //check if the user still exists in backend, otherwise delete him and all his chats
                    data[0].message = this.encryptionProvider.decrypt(data[0].message, data[0].timestamp, data[0].sender);
                    this.otherUsers = this.otherUsers.filter((foundUser: { name: any; }) => foundUser.name != chatpartner);
                    this.otherUsers.push(new ChatUser(chatpartner, data[0].sender + ": " + data[0].message, data[0].timestamp));
                    this.otherUsers = ChatUtils.sortParticipantsByDate(this.otherUsers);
                  }
                }
                else {
                  this.removeNoLongerExistingUser(chat, chatpartner);
                }
              }
            });
          this.subsList.push(subscription);
        }
      }
      this.subsList.push(outerSubscription);
      this.loadingData = false;
    });
  }

  removeNoLongerExistingUser(chat: any, chatpartner: string) {
    this.af.object(this.chatDataPath.CHATS + chat.chatId).remove();
    this.af.object(this.chatDataPath.USERS + this.ownUser + "/chats/" + chat.chatId).remove();
    this.af.object(this.chatDataPath.USERS + chatpartner).remove();
  }

  /**
   * [obsolete]
   * Users are loaded from Nubedian, not firebase anymore
   */
  loadUsersFromFirebase(): Promise<void> {
    return new Promise((resolve) => {
      this.af.list(this.chatDataPath.USERS).valueChanges()
        .subscribe(chatusers => {
          for (const chatuser of chatusers) {
            const username = chatuser["name"];
            if (username && username && username !== this.ownUser && !this.userArrayContains(this.otherUsers, username)) {
              this.otherUsers.push(new ChatUser(username));
            }
          }
          resolve();
        });
    });
  }

  showAlertIfNoMessages(users) {
    setTimeout(() => {
      let noMessages = true;
      for (const user of users) {
        if (user.lastMsg) {
          noMessages = false;
        }
      }
      if (noMessages) {
        this.showAlert();
      }
    }, 3000);
  }

  isOnline(): boolean {
    return this.connectivityService.isOnline;
  }

  openGroupChatWith(group) {
    let params: IDetailNavParams = {
      pageData: this.pageData,
      moduleData: this.moduleData,
      params: {
        data: {
          receiver: group.name,
          sender: this.ownUser,
          groupGGUID: group.GGUID,
          isGroupchat: true,
          role: group.role
        }
      }
    };
    this.nav.push(Chat, params);
  }

  openChatWith(receiver: string) {
    let chatIdPromise = new Promise<string>((resolve) => {
      let subscription = this.af.object(this.chatDataPath.USERS + "/" + this.ownUser).valueChanges()
        .subscribe(firebaseUserObject => {
          if (firebaseUserObject) {
            let chats = firebaseUserObject["chats"];
            //create this chat if it does not yet exist
            if (chats != null) {
              for (let currrentChatId in chats) {
                let chatMetaData = chats[currrentChatId];
                if (chatMetaData.participants.length == 2 && chatMetaData.participants.includes(receiver)) {
                  resolve(chatMetaData.chatId);
                }
              }
            }
            resolve(ChatUtils.uuidv4());
          }
        });
      this.subsList.push(subscription);
    });
    chatIdPromise.then((chatId: string) => {
      let chat = {
        chatId: chatId,
        participants: [this.ownUser, receiver]
      }
      this.af.object(this.chatDataPath.USERS + this.ownUser + "/chats/" + chatId).set(chat)
        .then(_ =>
          this.af.object(this.chatDataPath.USERS + receiver + "/chats/" + chatId).set(chat))
        .then(_ => {
          let params: IDetailNavParams = {
            pageData: this.pageData,
            moduleData: this.moduleData,
            params: {
              data: {
                chatId: chatId,
                receiver: receiver,
                sender: this.ownUser,
                isGroupchat: false
              }
            }
          };
          this.nav.push(Chat, params);
        });
    });
  }

  ionViewWillLeave() {
    var userNames = this.otherUsers.map(x => x.name);
    var localUsers = new ChatUserList(userNames);
    this.soniaStorageService.setForType(this.chatDataPath.USERS, localUsers);
    this.soniaStorageService.setForType(this.chatDataPath.GROUPS, this.groups);
    for (var subscription of this.subsList) {
      subscription.unsubscribe();
    }
  }

  getBackendGroups() {
    this.groups = [];
    this.addressService.getGroupsOfUser(this.authService._userCredentials.GGUID).subscribe(groups => {
      for (const group of groups) {
        if (!this.userArrayContains(this.groups, group.name)) {
          this.groups.push({
            name: group.name,
            GGUID: group.GGUID,
            role: group.role
          });
        }
        this.queryLastGroupMessagesRemotely(this.groups);
      }
      this.loadingData = false;
    });
  }

  searchGroups(ev: any) {
    if (!this.allGroups) {
      this.allGroups = this.groups;
    }
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.groups = this.allGroups.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    else {
      this.groups = this.allGroups;
      this.allGroups = null;
    }
  }

  queryLastGroupMessagesRemotely(groups) {
    for (const group of groups) {
      var sub = this.af.list((this.chatDataPath.GROUPS + group.name), ref => ref.orderByKey().limitToLast(1)).valueChanges().subscribe((data: any) => {
        if (data && data[0] && data[0].message && data[0].sender) {
          group["lastMsg"] = this.encryptionProvider.decrypt(data[0].message, data[0].timestamp, data[0].sender);
          group["timestamp"] = data[0].timestamp;
          this.groups = ChatUtils.sortParticipantsByDate(this.groups);
        }
        this.loadingData = false;
      });
      this.subsList.push(sub);
    }
  }

  openModal() {
    let boardModal = this.modalCtrl.create(CreateGroupModal);
    boardModal.onDidDismiss((_data) => {
      this.getBackendGroups();
    })
    boardModal.present();
  }


  //helper method to see if array contains this object already
  userArrayContains(array: any, element: any) {
    var found = false;
    for (var i = 0; i < array.length; i++) {
      if (array[i].name == element) {
        found = true;
        break;
      }
    }
    return found;
  }

  /*******************
  * NewsStream interface
  *
  * these two methods must be implemented as static in order to register for
  * the NewsStreamService
  ********************/

  /**
  * responsible for querying remote data from the DataService
  * use this as single access point to the DataService - set up the modules query logic here
  *
  * @returns Observable<any> - so this module and the NewsStreamService can subscribe to it
  **/
  public static getRemoteData(dataService: DataService, authService: AuthenticationService, _navParams: INavParams): Observable<IRemoteData> {
    return dataService.fetchFirebaseChatNews(authService.getFullUsername());
  }

  /**
  * @returns Component for single Entries of this modules data in the NewsStreamPage
          Component must expose attribute "displayData" as @Input
  **/
  public static getNewsStreamComponent() {
    return ChatNewsStreamComponent;
  }

}
