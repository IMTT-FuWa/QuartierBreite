import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherYounow extends ExternalModuleBase {

    /**
    * this should be configured to meet the apps expected identifiers
    **/
    schemes: IAppLauncherScheme = {
        appName: "YouNow: Live Stream Video Chat",
        iosScheme: {
            scheme: "younow://",
            storeUrl: "https://itunes.apple.com/de/app/younow-live-stream-video-chat/id471347413?mt=8",
        },
        androidScheme: {
            scheme: "younow.live",
            storeUrl: "https://play.google.com/store/apps/details?id=younow.live&hl=de",
        },
        wpScheme: "younow:"
    }

    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes);
        _paq.push(['trackEvent', 'Menu-Navigation', 'YouNow gestartet']);
    }
}
