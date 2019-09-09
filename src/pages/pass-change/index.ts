import { LoginPage } from '../login-page/index';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { App, NavParams, NavController, Loading, LoadingController, AlertController } from 'ionic-angular';
import { PageBase } from '../page-base';
import { AuthenticationService } from '../../providers/authentication/authentication-service';
import { LoginRemoteService } from "../../providers/remote-services/login-remote-service";

declare var _paq: any;

@Component({
  templateUrl: 'passChange-page.html'
})

export class PassChangePage extends PageBase {

  passChangeForm: FormGroup;
  currentPass: AbstractControl;
  newPass: AbstractControl;
  confirmPass: AbstractControl;
  rootNav;

  constructor(params: NavParams, fb: FormBuilder,
    public app: App,
    public loading: LoadingController,
    public alert: AlertController,
    public nav: NavController,
    public authenticationService: AuthenticationService,
    public loginRemoteService: LoginRemoteService
  ) {
    super(params);
    this.rootNav = app.getRootNav();
    this.passChangeForm = fb.group({
      'currentPass': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'newPass': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'confirmPass': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    }, {
        validator: this.MatchCurrentWithNewPassword,
        validator2: this.MatchNewWithConfirmPassword
      }
    )
    this.currentPass = this.passChangeForm.controls['currentPass'];
    this.newPass = this.passChangeForm.controls['newPass'];
    this.confirmPass = this.passChangeForm.controls['confirmPass'];

  }



  ionViewWillEnter() {
    _paq.push(['trackPageView', 'PasswordChangePage']);
  }

  public MatchCurrentWithNewPassword(abstractCtrl: AbstractControl) {
    let currentPass = abstractCtrl.get('currentPass').value; // to get value in input tag
    let newPass = abstractCtrl.get('newPass').value;
    if (currentPass == newPass) {
      abstractCtrl.get('newPass').setErrors({ MatchPassword: true });
    }
    else {
      return null;
    }
  }

  public MatchNewWithConfirmPassword(abstractCtrl: AbstractControl) {
    let newPass = abstractCtrl.get('newPass').value;
    let confirmPass = abstractCtrl.get('confirmPass').value;
    if (newPass !== confirmPass) {
      abstractCtrl.get('confirmPass').setErrors({ MatchPassword: true });
    }
    else {
      return null;
    }
  }

  onSubmit() {
    let loadingIndicator: Loading = this.createLoading();
    this.loginRemoteService.initTokenAndWait().then(() => {
      this.loginRemoteService.changePassword(this.newPass.value).subscribe(() => {
        loadingIndicator.dismiss();
        this.createAlert();
      });
    });
    // let loginSuccess = false;
  }

  onLogout() {
    this.authenticationService.logout();
    //logout und dann Weiterleitung auf LoginPage
    // this.app.getRootNav().setRoot(LoginPage);
  }

  createLoading() {
    let loading: Loading = this.loading.create({
      content: 'Password wird geändert...',
      dismissOnPageChange: false
    });
    loading.present();
    return loading;
  }

  createAlert() {
    let alert = this.alert.create({
      title: 'Passwort wurde geändert!',
      subTitle: 'Ihr Passwort wurde erfolgreich geändert. Sie werden jetzt ausgeloggt und auf die Loginseite weitergeleitet!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.onLogout();
            this.nav.push(LoginPage, {
              pageData: {
                pageTitle: 'Anmelden'
              },
              backToHome: true
            });
          }
        }
      ]
    });
    alert.present();
  }

}
