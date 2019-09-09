import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherYoutube extends ExternalModuleBase {

    /**
    * this should be configured to meet the apps expected identifiers
    **/
    schemes: IAppLauncherScheme = {
        appName: "YouTube",
        iosScheme: {
            scheme: "youtube://",
            storeUrl: "https://itunes.apple.com/de/app/youtube/id544007664?mt=8",
        },
        androidScheme: {
            scheme: "com.google.android.youtube",
            storeUrl: "https://play.google.com/store/apps/details?id=com.google.android.youtube&hl=de",
        },
        wpScheme: "youtube:"
    }

    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes);
        _paq.push(['trackEvent', 'Menu-Navigation', 'YouTube gestartet']);
    }
}
