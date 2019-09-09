import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherDBahn extends ExternalModuleBase {

    /**
    * this should be configured to meet the apps expected identifiers
    **/
    schemes: IAppLauncherScheme = {
        appName: "Deutsche Bahn Navigator",
        iosScheme: {
            scheme: "db-navigator://",
            storeUrl: "https://itunes.apple.com/de/app/db-navigator/id343555245?mt=8",
        },
        androidScheme: {
            scheme: "de.hafas.android.db",
            storeUrl: "https://play.google.com/store/apps/details?id=de.hafas.android.db&hl=de",
        },
        wpScheme: "db-navigator:"
    }

    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes);
        _paq.push(['trackEvent', 'Menu-Navigation', 'Deutsche Bahn Navigator gestartet']);
    }
}
