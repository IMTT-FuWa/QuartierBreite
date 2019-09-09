import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherSWR extends ExternalModuleBase {

    /**
    * this should be configured to meet the apps expected identifiers
    **/

    schemes: IAppLauncherScheme = {
        appName: "SWR Mediathek",
        iosScheme: {
            scheme: "swr://",
            storeUrl: "https://itunes.apple.com/de/app/swr-mediathek/id655052131?mt=8",
        },
        androidScheme: {
            scheme: "de.swr.mediathek",
            storeUrl: "https://play.google.com/store/apps/details?id=de.swr.mediathek&hl=de",
        },
        wpScheme: "elchradio:"
    }

    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes);
        _paq.push(['trackEvent', 'Menu-Navigation', 'SWR-Radio gestartet']);
    }
}
