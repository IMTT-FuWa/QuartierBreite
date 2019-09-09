import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { App, NavParams, NavController, Loading, LoadingController, AlertController } from 'ionic-angular';
import { PageBase } from '../page-base';
import { AuthenticationService } from '../../providers/authentication/authentication-service';
import { LoginRemoteService } from '../../providers/remote-services/login-remote-service';


declare var _paq: any;

@Component({
  templateUrl: 'login-page.html'
})

export class LoginPage extends PageBase {

  authForm: FormGroup;
  username: AbstractControl;
  password: AbstractControl;
  rootNav;
  backToHome: boolean = false;

  constructor(public params: NavParams, fb: FormBuilder,
    public app: App,
    public loading: LoadingController,
    public alert: AlertController,
    public nav: NavController,
    public authenticationService: AuthenticationService,
    public loginRemoteService: LoginRemoteService,
  ) {
    super(params);
    this.rootNav = app.getRootNav();
    this.authForm = fb.group({
      'username': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(3)])]
    });
    this.backToHome = this.params.data.backToHome ? true : false;
    this.username = this.authForm.controls['username'];
    this.password = this.authForm.controls['password'];
  }

  ionViewWillEnter() {
    _paq.push(['trackPageView', 'LoginPage']);
  }


  onSubmit() {
    let loadingIndicator: Loading = this.createLoading();
    if (this.authForm.valid) {
      this.loginRemoteService.login(this.username.value, this.password.value).subscribe(
        loginData => {
          if (loginData) {
            this.authenticationService.saveLogin(loginData);
            loadingIndicator.dismiss().then(() => {
              if (this.backToHome) {
                this.rootNav.popToRoot();
              }
              else {
                this.rootNav.pop();
              }
            });
          }
        },
        error => {
          loadingIndicator.dismiss();
          this.createAlert('Anmeldung fehlgeschlagen', error);
        });
    } else {
      loadingIndicator.dismiss();
      console.error('LoginForm: invalid Form data');
    }
  }

  createLoading() {
    let loading: Loading = this.loading.create({
      content: 'Anmelden...',
      dismissOnPageChange: false
    });
    loading.present();
    return loading;
  }

  createAlert(title: string, message: string) {
    let alert = this.alert.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => { }
        }
      ]
    });
    alert.present();
  }
}
