import { Injectable } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AuthenticationService } from './authentication-service';
import { LoginPage } from '../../pages/login-page/index';
import { IPageData } from '../../shared-interfaces/data';

@Injectable()
export class LoginRedirectService {

    nav: NavController;

    loginPageData: IPageData = {
        pageTitle: 'Anmelden'
    }

    /**
    * we inject the app reference to get a reference to the root NavController
    **/
    constructor(
        public authService: AuthenticationService,
        public alert: AlertController) {
    }

    redirectRequired(needsAuth) {
        // todo check authservice if logged in
        if (needsAuth && !this.authService.isAuthenticated) {
            return true;
        }
        return false;
    }

    /**
    * if we transition to @page modules, we have to remove the last
    * state on the stack (the alert) after transition. this is not the case
    * for external modules
    **/
    confirmRedirect(nav: NavController, removeLastState: boolean = true): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let alert = this.alert.create({
                title: 'Login wird benötigt',
                message: 'Um diese Funktionalität zu nutzen, müssen Sie sich anmelden.',
                buttons: [
                    {
                        text: 'Abbrechen',
                        role: 'cancel',
                        handler: () => {
                            reject();
                        }
                    },
                    {
                        text: 'Zur Anmeldung',
                        handler: () => {
                            resolve();
                            let alertTransition = alert.dismiss();
                            alertTransition.then(() => {
                                if (removeLastState) {
                                    this.pushLogin(nav).then(() => {
                                        nav.remove(nav.length() - 2);
                                    });
                                } else {
                                    this.pushLogin(nav);
                                }
                            });
                            return false;
                        }
                    }
                ]
            });
            alert.present();
        });
    }

    pushLogin(nav: NavController) {
        return nav.push(LoginPage, {
            pageData: this.loginPageData
        });
    }
}
