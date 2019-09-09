import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { ExternalModuleBase } from '../../modules/module-base';
import { InAppBrowserService } from '../../providers/in-app-browser/index';
import { LoginRedirectService } from '../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../providers/connectivity/index';

/**
* All external normal modules must extend ExternalModuleBase and have to be
* decorated by @Injectable
* also they must implement the abstract runExternal() method which gets
* invoked when navigating to this modules from overview pages
**/
declare var _paq: any;

@Injectable()
export class ExternalBrowser extends ExternalModuleBase {

    needsAuth: boolean = false;

    constructor(lrService: LoginRedirectService, cnService: ConnectivityService, public inAppBrowser: InAppBrowserService,
        public alertController: AlertController) {
        super(lrService, cnService);
    }

    runExternal() {
        let url = this.moduleData.externalUrl;
        this.ensureIsOnline(_ => {
            this.inAppBrowser.open(url).then(
                _ => { },
                (error) => { console.warn('ExternalBrowser: ' + error) }
            );
        })
        _paq.push(['trackEvent', 'Menu-Navigation', 'External Browser gestartet']);
    }
}
