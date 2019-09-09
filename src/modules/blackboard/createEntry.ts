//ionic/angular
import { Component } from '@angular/core';
import {Platform, NavParams,  NavController,  AlertController} from 'ionic-angular';
import { ModuleBase } from '../module-base';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { ImageViewerController } from 'ionic-img-viewer';

//helper functions
import { confirmAction } from '../../utilities/ConfirmActionAlert';
import { IDetailNavParams } from '../../shared-interfaces/data';
import { Blackboard } from './blackboard';

//services
import { SoniaStorageService } from '../../providers/data-service/soniaStorageService';
import { ConnectivityService } from '../../providers/connectivity/index';
import { LoginRedirectService } from '../../providers/authentication/login-redirect-service';
import { BlackboardRemoteService } from "../../providers/remote-services/blackboard-remote-service";


declare var _paq: any;

@Component({
  templateUrl: 'createEntry.html'
})
export class BlackboardCreateEntry extends ModuleBase {

  public formControls: FormGroup;
  public blackboard: any;
  public post: any;
  public user: string;
  public title: AbstractControl;
  public content: AbstractControl;
  public link: AbstractControl;
  public image;
  public imageGGUID;
  public validUntil: any;
  public canLeave = false;
  public _imageViewerCtrl: ImageViewerController;


  constructor(public navParams: NavParams,
    public nav: NavController,
    public alertController: AlertController,
    public soniaStorageService: SoniaStorageService,
    public loginRedirectService: LoginRedirectService,
    public conn: ConnectivityService,
    public fb: FormBuilder,
    public alert: AlertController,
    private camera: Camera,
    public blackboardService: BlackboardRemoteService,
    public imageViewerCtrl: ImageViewerController,
    public platform: Platform
  ) {
    super(navParams, nav, loginRedirectService);
    var params = this.navParams.get('params');
    this._imageViewerCtrl = imageViewerCtrl;
    this.blackboard = params.data.blackboard;
    this.user = params.data.user;
    if (!params.data.post) {
      this.formControls = fb.group({
        'title': ['', Validators.compose([Validators.required])],
        'content': ['', Validators.compose([Validators.required])],
        'link': ['']
      });
    }
    else {
      //indicates this is an edit
      this.post = params.data.post;
      this.title = this.post.title;
      this.content = this.post.content;
      this.link = this.post.link;
      this.formControls = fb.group({
        'title': [this.post.title, Validators.compose([Validators.required])],
        'content': [this.post.content, Validators.compose([Validators.required])],
        'link': [{ value: this.post.weblink, disabled: false }]
      });
    }
    this.title = this.formControls.controls['title'];
    this.content = this.formControls.controls['content'];
    this.link = this.formControls.controls['link'];
  }



  ionViewWillEnter() {
    _paq.push(['trackPageView', 'Schwarzes Brett Eintrag erstellen']);
    if (this.post && this.post.GGUID) {
      this.blackboardService.getEntryDetails(this.post.GGUID).subscribe(details => {
        this.post = details;
        if (details.document) {
          this.image = details.document;
        }
      });
    }
  }

  createBlackboardPost() {
    if (this.user && this.title && this.content) {
      let post = {
        title: this.title.value,
        content: this.content.value,
        author: this.user,
        blackboardGGUID: this.blackboard.GGUID,
        weblink: this.link.value,
        document: this.image
      }
      if (!this.post) {
        //create post
        this.blackboardService.createEntry(post).subscribe(_x => {
          this.canLeave = true;
          _paq.push(['trackEvent', 'Menu-Navigation', 'Schwarzes Brett Eintrag erstellt']);
          this.openBlackboard(this.blackboard);
        });
      }
      else {
        if (this.post.GGUID && this.post.ETAG){
          post["ETAG"] = this.post.ETAG;
          post["GGUID"] = this.post.GGUID; 
        }
        if (this.post.documentGGUID){
          post["documentGGUID"] = this.post.documentGGUID;
        }
        //update post
        this.blackboardService.updateEntry(post, this.post.GGUID).subscribe(_x => {
          this.canLeave = true;
          _paq.push(['trackEvent', 'Menu-Navigation', 'Schwarzes Brett Eintrag aktualisiert']);
          this.openBlackboard(this.blackboard);
        });
      }
    }
  }

  accessGallery() {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: this.camera.DestinationType.DATA_URL
    }).then((imageData) => {
      this.image = imageData;
    }, (err) => {
      console.log(err);
    });
  }

  accessCamera() {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL
    }).then((imageData) => {
      this.image = imageData;
    }, (err) => {
      console.log(err);
    });
  }

  isEditing() {
    if (this.post) {
      return true;
    }
    return false;
  }

  //methods required to confirm view leaving with modal window

  exitView() {
    super.confirmLeaveView(this.alertController, this.canLeave).then(_resolve => {
      this.canLeave = true;
      this.openBlackboard(this.blackboard);
    },
      _reject => {
        //do nothing
      })
  }

  openBlackboard(blackboard) {
    let params: IDetailNavParams = {
      pageData: this.pageData,
      moduleData: this.moduleData,
      params: {
        data: blackboard
      }
    };
    this.nav.push(Blackboard, params);
  }

  public leaveView() {
    super.confirmLeaveView(this.alertController, this.canLeave).then(_resolve => {
      this.canLeave = true;
      this.nav.popToRoot();
    },
      _reject => {
        //do nothing
      })
  }

  ionViewCanLeave(): Promise<void> {
    return super.confirmLeaveView(this.alert, this.canLeave);
  }

  delete(post) {
    confirmAction(this.alertController,
      "Möchten Sie den Eintrag " + post.title + " löschen?",
      "Sind sie sicher?",
      () => {
        //delete post
        this.blackboardService.deleteEntry(this.post.GGUID).subscribe(_x => {
          this.canLeave = true;
          this.openBlackboard(this.blackboard);
        });
        _paq.push(['trackEvent', 'Menu-Navigation', 'Schwarzes Brett Eintrag gelöscht']);
      }
    );
  }
  removeImage() {
    this.image = null;
  }

  public openPhoto(image: string) {
    const imageViewer = this._imageViewerCtrl.create(image);
    imageViewer.present();
  }

}
