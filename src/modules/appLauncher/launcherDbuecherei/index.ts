import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherDbuecherei extends ExternalModuleBase {

    /**
    * this should be configured to meet the apps expected identifiers
    **/
    schemes: IAppLauncherScheme = {
        appName: "Onleihe",
        iosScheme: {
            scheme: "had6f9d2a6b7f2592c39ff36961a343018://",
            storeUrl: "https://itunes.apple.com/de/app/onleihe/id422554835?mt=8",
        },
        androidScheme: {
            scheme: "de.etecture.ekz.onleihe",
            storeUrl: "https://play.google.com/store/apps/details?id=de.etecture.ekz.onleihe&hl=de",
        },
        wpScheme: "onleihe:"
    }

    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes);
        _paq.push(['trackEvent', 'Menu-Navigation', 'Onleihe gestartet']);
    }
}
