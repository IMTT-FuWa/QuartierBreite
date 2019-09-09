import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherHangouts extends ExternalModuleBase {

    /**
    * this should be configured to meet the apps expected identifiers
    **/
    schemes: IAppLauncherScheme = {
        appName: "Google Hangouts",
        iosScheme: {
            scheme: "com.google.hangouts://",
            storeUrl: "https://itunes.apple.com/de/app/hangouts/id643496868?mt=8",
        },
        androidScheme: {
            scheme: "com.google.android.talk",
            storeUrl: "https://play.google.com/store/apps/details?id=com.google.android.talk&hl=de",
        },
        wpScheme: "gtalk:"
    }

    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes);
        _paq.push(['trackEvent', 'Menu-Navigation', 'Google Hangouts gestartet']);
    }
}
