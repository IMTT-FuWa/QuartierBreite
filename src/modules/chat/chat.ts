import { Component, ViewChild } from '@angular/core';
import { Platform, NavParams, NavController, AlertController, Content } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { ModuleBase } from '../module-base';
import { ChatMessage } from './objects/chatMessage';
import { ChatDataPath } from './objects/chatDataPath';
import { ChatMessageList } from './objects/chatMessageList';
import { SoniaStorageService } from '../../providers/data-service/soniaStorageService';
import { ConnectivityService } from '../../providers/connectivity/index';
import { LoginRedirectService } from '../../providers/authentication/login-redirect-service';
import { arrayContains } from '../../utilities/array-contains';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { IDetailNavParams } from '../../shared-interfaces/data';
import { GroupUsers } from './groupusers';
import { AddressRemoteService } from '../../providers/remote-services/address-remote-service';
import { ImageViewerController } from 'ionic-img-viewer';
import { ImagesToFileSystemProvider } from '../../providers/images-to-file-system/images-to-file-system';
import { EncryptionProvider } from '../../providers/encryption/encryption';

@Component({
  templateUrl: 'chat.html',
  queries: {
    content: new ViewChild('content')
  }
})
export class Chat extends ModuleBase {
  chat: any;

  private fontSize = 16;
  public fontSizeNote = 14;

  //sender and receiver of the current chat session
  private sender: string;
  private receiver: string;
  //for determining whether this is a groupchat or not
  private isGroupchat: boolean;
  private role: string;
  private groupGGUID: string;
  //we need 2 kind of message arrays, one for our local presentation (chatMessages)
  private chatMessages: Array<ChatMessage>;
  //and one for observing and pushing to the firebase cloud database
  private chatMessagesFire: AngularFireList<any>;
  //the chatinp is the field in which a user can write a message
  public chatinp: string;
  //types required for querying operations
  private chatDataPath: ChatDataPath;
  private subscription: any;
  private prevDate;
  private context: string;
  public loadingData: boolean = true;
  //content is our html-content which is required here for auto-scrolling down
  @ViewChild(Content) content: Content;
  public _imageViewerCtrl: ImageViewerController;

  constructor(private navParams: NavParams,
    private nav: NavController,
    private alertController: AlertController,
    private af: AngularFireDatabase,
    private soniaStorageService: SoniaStorageService,
    public loginRedirectService: LoginRedirectService,
    private connectivityService: ConnectivityService,
    private addressService: AddressRemoteService,
    private camera: Camera,
    private imageToFileSystem: ImagesToFileSystemProvider,
    private platform: Platform,
    public imageViewerCtrl: ImageViewerController,
    private encryptionProvider: EncryptionProvider
  )
  // public soniaStorageService: SoniaStorageService)
  {
    super(navParams, nav, loginRedirectService);
    var params = this.navParams.get('params');
    this._imageViewerCtrl = imageViewerCtrl;
    this.receiver = params.data.receiver;
    this.sender = params.data.sender;
    this.isGroupchat = params.data.isGroupchat;
    this.groupGGUID = params.data.groupGGUID;
    this.role = params.data.role;
    this.chatinp = '';
    this.chatMessages = [];
    this.chatDataPath = new ChatDataPath();

  }

  ionViewWillEnter() {
    if (this.isGroupchat) {
      this.context = this.chatDataPath.GROUPS + this.receiver;
    }
    else {
      this.context = this.chatDataPath.CHATS + this.navParams.get('params').data.chatId;;
    }
    if (this.connectivityService.isOnline) {
      this.queryMessagesRemotely();
    }
    else {
      this.queryMessagesLocally();
    }
  }


  queryMessagesLocally() {
    // query for locally saved users
    if (this.platform.is('mobile')) {
      this.soniaStorageService.getForType(this.context).then(x => {
        if (x && x.messages) {
          for (var message of x.messages) {
            if (!arrayContains(this.chatMessages, message)) {
              this.chatMessages.push(message);
            }
          }
        }
      },
        error => {
          console.log(error);
        });
    }
  }

  queryMessagesRemotely() {
    //get our firebase database with this chat session
    this.chatMessagesFire = this.af.list(this.context);
    // map all messages into our local array, subscribe to changes and display them
    this.subscription = this.chatMessagesFire.snapshotChanges()
      .map(action => {
        let mappedChatList = [];
        action.forEach(chatData => {
          const $key = chatData.payload.key;
          const data = { $key, ...chatData.payload.val() };
          mappedChatList.push(data);
        });
        return mappedChatList;
      }).subscribe((chatList: any) => {
        for (var chat of chatList) {
          var read = chat.read;
          if (!chat.read && chat.sender != this.sender) {
            read = true;
            this.af.object(this.context + "/" + chat.$key + "/read").set(read);
          }
          chat.message = this.encryptionProvider.decrypt(chat.message, chat.timestamp, chat.sender);
          var chatMessage = new ChatMessage(chat.message, chat.sender, chat.timestamp, read, chat.image, chat.$key);
          //do not show the same messages multiple times
          switch (this.messageStatus(chatMessage)) {
            case 0:
              //message is completely new
              this.chatMessages.push(chatMessage);
              break;
            case 1:
              //read status has changed
              this.changeReadStatus(chatMessage);
              break;
            default:
            //message is already pushed
          }
        }
        this.loadingData = false;
      });
  }

  messageStatus(message: ChatMessage): number {
    for (var currentMessage of this.chatMessages) {
      //if 2 messages were sent in the same milisecond, we can assume they are the same message
      if (message.timestamp == currentMessage.timestamp) {
        if (message.read != currentMessage.read) {
          return 1;
        }
        return -1;
      }
    };
    return 0;
  }

  changeReadStatus(message: ChatMessage) {
    for (var i = this.chatMessages.length - 1; i >= 0; i--) {
      if (this.chatMessages[i].timestamp == message.timestamp) {
        this.chatMessages[i].read = message.read;
      }
    }
  }

  //scrolls to bottom whenever the page has loaded
  ionViewDidEnter() {
    this.content.scrollToBottom();
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
    if (this.platform.is('mobile')) {
      var localChatMessages = new ChatMessageList(this.chatMessages);
      this.soniaStorageService.setForType(this.context, localChatMessages, null);
    }
    this.imageToFileSystem.saveImagesFromChat(this.receiver, this.context);
  }

  //send message to the firebase cloud
  send(message) {
    if (message && message !== "" && message !== "\n") {
      this.ensureIsOnline(this.alertController, this.connectivityService, _ => {
        let chatMessage = new ChatMessage(message, this.sender, message.$key);
        chatMessage["message"] = this.encryptionProvider.encrypt(message, chatMessage.timestamp, chatMessage.sender);
        const promise = this.chatMessagesFire.push(chatMessage);
        promise.then((_success) => {
          this.chatinp = ""; //clear chat input
          this.content.resize();
          this.content.scrollToBottom(); //scroll down in chat
        });
      })
    }
  }

  formatSender(sender) {
    if (sender == this.sender) {
      return "Sie";
    }
    else return sender;
  }

  isSender(sender) {
    return sender == this.sender;
  }

  hasChanged(curDate): boolean {
    if (this.prevDate - 1 < curDate) {
      this.prevDate = curDate;
      return true;
    }
    else {
      this.prevDate = curDate;
      return false;
    }
  }

  accessGallery() {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: this.camera.DestinationType.DATA_URL
    }).then((imageData) => {
      var chatMessage = new ChatMessage("Bild", this.sender, null, false, 'data:image/jpeg;base64,' + imageData);
      this.chatMessagesFire.push(chatMessage);
    }, (err) => {
      console.log(err);
    });
  }

  accessCamera() {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL
    }).then((imageData) => {
      var chatMessage = new ChatMessage("Bild", this.sender, null, false, 'data:image/jpeg;base64,' + imageData);
      this.chatMessagesFire.push(chatMessage);
    }, (err) => {
      console.log(err);
    });
  }

  isOnline(): boolean {
    return this.connectivityService.isOnline;
  }

  openPhoto(image: string) {
    // this.photoViewer.show(img);
    const imageViewer = this._imageViewerCtrl.create(image);
    imageViewer.present();
  }

  expand() {
    if (this.fontSize == 16) {
      this.fontSize = 25;
    }
    else {
      this.fontSize = 16;
    }
    this.fontSizeNote = this.fontSize - 2;
  }

  deleteMessage(message) {
    //delete on firebase
    this.af.object(this.context + "/" + message.key).remove().then(_x => {
      //delete from View
      let index = this.chatMessages.indexOf(message);
      this.chatMessages.splice(index, 1);
    },
      error => {
        console.log(error);
      });
  }

  deleteGroup() {
    let alertPopup = this.alertController.create({
      title: "Gruppe löschen",
      message: "Möchten Sie diese Gruppe wirklich löschen?",
      buttons: [
        {
          text: 'Ja',
          handler: () => {
            this.addressService.deleteGroup(this.groupGGUID).subscribe(_result => {
              this.nav.pop();
            });
          }
        },
        {
          text: 'Nein',
          handler: () => {
            //dismiss
          }
        }
      ]
    });
    alertPopup.present();
  }

  hasModRights() {
    return this.role == "ADD_GRPADMIN";
  }

  goToUsers() {
    let params: IDetailNavParams = {
      pageData: this.pageData,
      moduleData: this.moduleData,
      params: {
        data: {
          groupGGUID: this.groupGGUID,
          role: this.role
        }
      }
    };
    this.nav.push(GroupUsers, params);
  }

}
