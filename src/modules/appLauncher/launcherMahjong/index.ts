import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherMahjong extends ExternalModuleBase {

    /**
    * this should be configured to meet the apps expected identifiers
    **/
    schemes: IAppLauncherScheme = {
        appName: "Green Mahjong",
        iosScheme: {
            scheme: "greenmahjong://",
            storeUrl: "https://itunes.apple.com/de/app/green-mahjong/id933634500?l=en&mt=8",
        },
        androidScheme: {
            scheme: "de.beck.greenmahjong",
            storeUrl: "https://play.google.com/store/apps/details?id=de.beck.greenmahjong&hl=de",
        },
        wpScheme: "greenmahjong:"
    }

    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes);
        _paq.push(['trackEvent', 'Menu-Navigation', 'Green Mahjong gestartet']);
    }
}
