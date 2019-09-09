import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherAnagramm extends ExternalModuleBase {

    /**
    * this should be configured to meet the apps expected identifiers
    **/
    schemes: IAppLauncherScheme = {
        appName: "Anagramm in Deutsch",
        iosScheme: {
            scheme: "anagramm://",
            storeUrl: "https://itunes.apple.com/de/app/anagramm/id348884830?mt=8",
        },
        androidScheme: {
            scheme: "com.dbenet.AnagramaGerman",
            storeUrl: "https://play.google.com/store/apps/details?id=com.dbenet.AnagramaGerman&hl=de",
        },
        wpScheme: "anagramm:"
    }

    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes);
        _paq.push(['trackEvent', 'Menu-Navigation', 'Anagramm gestartet']);
    }
}
