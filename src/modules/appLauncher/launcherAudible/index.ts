import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherAudible extends ExternalModuleBase {

    /**
    * this should be configured to meet the apps expected identifiers
    **/
    schemes: IAppLauncherScheme = {
        appName: "Audible",
        iosScheme: {
            scheme: "audible://",
            storeUrl: "https://itunes.apple.com/gb/app/audible-audio-books-original-series-podcasts/id379693831?mt=8",
        },
        androidScheme: {
            scheme: "com.audible.application",
            storeUrl: "https://play.google.com/store/apps/details?id=com.audible.application&hl=de",
        },
        wpScheme: "audible:"
    }

    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes);
        _paq.push(['trackEvent', 'Menu-Navigation', 'Audible gestartet']);
    }
}
