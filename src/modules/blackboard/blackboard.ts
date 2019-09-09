//ionic/angular
import { Component } from '@angular/core';
import { NavParams, NavController, AlertController, Platform } from 'ionic-angular';
import { ModuleBase } from '../module-base';
import { IDetailNavParams } from '../../shared-interfaces/data';

//helper functions
import { confirmAction } from '../../utilities/ConfirmActionAlert';

//services
import { AuthenticationService } from '../../providers/authentication/authentication-service';
import { SoniaStorageService } from '../../providers/data-service/soniaStorageService';
import { ConnectivityService } from '../../providers/connectivity/index';

// sub pages
import { BlackboardCreateEntry } from './createEntry';
import { BlackboardEntryDetail } from './entryDetail';
import { BoardUsers } from './boardusers';
import { BlackboardList } from './index';
import { BlackboardRemoteService } from "../../providers/remote-services/blackboard-remote-service";

//blackboard data objects

declare var _paq: any;

@Component({
  templateUrl: 'blackboard.html',
})
export class Blackboard extends ModuleBase {

  blackboard: any;
  posts: any[];
  user: any;
  loadingData: boolean = true;

  constructor(public navParams: NavParams,
    public nav: NavController,
    public alertController: AlertController,
    public soniaStorageService: SoniaStorageService,
    public authService: AuthenticationService,
    public conn: ConnectivityService,
    public platform: Platform,
    public blackboardService: BlackboardRemoteService,
    public alert: AlertController
  ) {
    super(navParams, nav);
    var params = this.navParams.get('params');
    this.blackboard = params.data;
  }

  loadPosts() {
    this.posts = [];
    this.blackboardService.getEntriesForBoard(this.blackboard.GGUID).subscribe(posts => {
      for (var post of posts) {
        this.posts.push(post);
      }
      this.posts.sort(function (a, b) {
        var dateA = new Date(a.timestamp), dateB = new Date(b.timestamp);
        if (dateA < dateB) { //sort string ascending
          return 1;
        }
        if (dateA > dateB) {
          return -1;
        }
        return 0; //default return value (no sorting)
      });
      this.loadingData = false;
    })
  }

  ionViewWillEnter() {
    this.loadPosts();
    this.user = this.authService.getFullUsername();
  }

  isUserOfPost(post) {
    return (this.user == post.author);
  }

  hasModRights() {
    return this.blackboard.role == "ADD_ADMIN" || this.blackboard.role == "ADD_EDITOR";
  }

  hasWriteRights(){
    return this.blackboard.role == "ADD_MODERATOR"
  }

  goToDetail(post) {
    let params: IDetailNavParams = {
      pageData: this.pageData,
      moduleData: this.moduleData,
      params: {
        data: {
          user: this.user,
          blackboard: this.blackboard,
          post: post
        }

      }
    };
    this.nav.push(BlackboardEntryDetail, params);
  }

  goToCreate() {
    let params: IDetailNavParams = {
      pageData: this.pageData,
      moduleData: this.moduleData,
      params: {
        data: {
          user: this.user,
          blackboard: this.blackboard
        }

      }
    };
    this.nav.push(BlackboardCreateEntry, params);
  }

  goToUsers() {
    let params: IDetailNavParams = {
      pageData: this.pageData,
      moduleData: this.moduleData,
      params: {
        data: this.blackboard
      }
    };
    this.nav.push(BoardUsers, params);
  }

  edit(post) {
    let params: IDetailNavParams = {
      pageData: this.pageData,
      moduleData: this.moduleData,
      params: {
        data: {
          user: this.user,
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
          this.loadPosts();
        });
        _paq.push(['trackEvent', 'Menu-Navigation', 'Schwarzes Brett Eintrag gelöscht']);
      }
    );
  }
  goToBlackboardDesc(){
    let alert = this.alert.create({
      title: 'Beschreibung von ' + this.blackboard.title,
      subTitle: this.blackboard.description, 
      buttons: [
        {
          text: 'OK',
          handler: () => {
          }
        }
      ]
    });
    alert.present();    
  }

  backToIndex() {
    let params: IDetailNavParams = {
      pageData: this.pageData,
      moduleData: this.moduleData,
      params: {
      }
    };
    this.nav.push(BlackboardList, params);
  }

}
