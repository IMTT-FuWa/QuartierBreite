import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherEigeneDateien extends ExternalModuleBase {

    /**
    * this should be configured to meet the apps expected identifiers
    **/
    schemes: IAppLauncherScheme = {
        appName: "Meine Dokumente",
        iosScheme: {
            scheme: "files://",
            storeUrl: "",
        },
        androidScheme: {
            scheme: "com.sec.android.app.myfiles||com.google.sec.android.app.myfiles||com.metago.astro",
            storeUrl: "https://play.google.com/store/apps/details?id=com.metago.astro&hl=de",
        },
        wpScheme: "myfiles:"
    }

    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes);
        _paq.push(['trackEvent', 'Menu-Navigation', 'Meine Dokumente gestartet']);
    }
}
