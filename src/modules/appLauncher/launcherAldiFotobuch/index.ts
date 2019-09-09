import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherAldiFotobuch extends ExternalModuleBase {

    /**
    * this should be configured to meet the apps expected identifiers
    **/
    schemes: IAppLauncherScheme = {
        appName: "ALDI Photo",
        iosScheme: {
            scheme: "aldi-photo://",
            storeUrl: "https://itunes.apple.com/de/app/aldi-photo/id517976174?mt=8",
        },
        androidScheme: {
            scheme: "com.medion.aldiphotonew",
            storeUrl: "https://play.google.com/store/apps/details?id=com.medion.aldiphotonew&hl=de",
        },
        wpScheme: "com.medion.aldiphotonew:"
    }

    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes);
        _paq.push(['trackEvent', 'Menu-Navigation', 'ALDI Photo gestartet']);
    }
}
