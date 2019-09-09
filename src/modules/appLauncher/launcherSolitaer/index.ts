import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherSolitaer extends ExternalModuleBase {

    /**
    * this should be configured to meet the apps expected identifiers
    **/
    schemes: IAppLauncherScheme = {
        appName: "Solitaire",
        iosScheme: {
            scheme: "mwsolitaire://",
            storeUrl: "https://itunes.apple.com/us/app/solitaire/id359917414?mt=8",
        },
        androidScheme: {
            scheme: "com.mobilityware.solitaire",
            storeUrl: "https://play.google.com/store/apps/details?id=com.mobilityware.solitaire&hl=de",
        },
        wpScheme: "solitaire:"
    }

    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes);
        _paq.push(['trackEvent', 'Menu-Navigation', 'Solitaire gestartet']);
    }
}
