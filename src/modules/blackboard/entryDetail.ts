//ionic/angular
import { IDetailNavParams } from '../../shared-interfaces/data';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavParams, NavController, PopoverController, AlertController } from 'ionic-angular';
import { ModuleBase } from '../module-base';
import { PopoverPage } from "./popoverPage";
import { InAppBrowserService } from '../../providers/in-app-browser/index';
import { ImageViewerController } from 'ionic-img-viewer';

// sub pages
import { Blackboard } from './blackboard';
import { BlackboardCreateEntry } from './createEntry';

//helper functions
import { confirmAction } from '../../utilities/ConfirmActionAlert';

//services
import { AuthenticationService } from '../../providers/authentication/authentication-service';
import { BlackboardRemoteService } from "../../providers/remote-services/blackboard-remote-service";
import { DomSanitizer } from '@angular/platform-browser';
import { ImagesToFileSystemProvider } from '../../providers/images-to-file-system/images-to-file-system';


declare var _paq: any;
/**
* All normal modules must extend ModuleBase and have to be
* decorated by @Page
**/
@Component({
  templateUrl: 'entryDetail.html'
})
export class BlackboardEntryDetail extends ModuleBase {
  @ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
  @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;
  public _imageViewerCtrl: ImageViewerController;

  needsAuth: boolean = false;
  blackboard: string;
  proposal: any;
  currentUser: string;

  constructor(
    public navParams: NavParams,
    public authService: AuthenticationService,
    public nav: NavController,
    public alertController: AlertController,
    public inAppBrowser: InAppBrowserService,
    public popoverCtrl: PopoverController,
    public blackboardService: BlackboardRemoteService,
    public imageViewerCtrl: ImageViewerController,
    public sanitizer: DomSanitizer,
    public imageToFileSystem: ImagesToFileSystemProvider
  ) {
    super(navParams, nav);
    var params = this.navParams.get('params');
    this._imageViewerCtrl = imageViewerCtrl;
    this.proposal = params.data.post;
    if (params.data.blackboard) {
      this.blackboard = params.data.blackboard;
    } else {
      //coming from news stream
      this.blackboard = this.proposal.blackboard;
    }
    if (params.data.user) {
      this.currentUser = params.data.user;
    }
    else {
      this.currentUser = authService.getFullUsername();
    }
    // this.af.object("blackboard/" + this.post.title).subscribe(image => {
    //   this.image = image.$value;
    // });
  }

  ionViewWillEnter() {
    _paq.push(['trackPageView', 'Schwarzes Brett Eintrag Details']);
    this.blackboardService.getEntryDetails(this.proposal.GGUID).subscribe(details=>{
      this.proposal = details;
    });
  }

  ionViewWillLeave(){
    this.imageToFileSystem.saveImagesFromBlackboard(this.proposal)
  }

  presentPopover(ev) {

    let popover = this.popoverCtrl.create(PopoverPage, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });

    popover.present({
      ev: ev
    });
  }

  openBlackboard() {
    let params: IDetailNavParams = {
      pageData: this.pageData,
      moduleData: this.moduleData,
      params: {
        data: this.blackboard
      }
    };
    this.nav.push(Blackboard, params);
    _paq.push(['trackEvent', 'Menu-Navigation', 'Schwarzes Brett Einträge']);
  }

  openLink(link) {
    if (!link.startsWith("http://")) {
      link = "http://" + link;
    }
    this.inAppBrowser.open(link).then(
      _ => { },
      (error) => { console.warn('ExternalBrowser: ' + error) }
    );
  }

  edit(post) {
    let params: IDetailNavParams = {
      pageData: this.pageData,
      moduleData: this.moduleData,
      params: {
        data: {
          user: this.proposal.author,
          blackboard: this.blackboard,
          post: post
        }

      }
    };
    this.nav.push(BlackboardCreateEntry, params);
  }

  delete(post) {
    confirmAction(this.alertController,
      "Möchten Sie den Eintrag " + post.title + " löschen?",
      "Sind sie sicher?",
      () => {
        this.blackboardService.deleteEntry(post.GGUID).subscribe(_x => {
          this.nav.pop();
        });
        _paq.push(['trackEvent', 'Menu-Navigation', 'Schwarzes Brett Eintrag gelöscht']);
      }
    );
  }

  isUserOfPost() {
    return (this.currentUser == this.proposal.author);
  }

  public openPhoto(image: string) {
    const imageViewer = this._imageViewerCtrl.create(image);
    imageViewer.present();
  }

}
