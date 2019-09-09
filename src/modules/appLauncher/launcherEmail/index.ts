import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherEmail extends ExternalModuleBase {

    /**
    * this should be configured to meet the apps expected identifiers
    **/
    schemes: IAppLauncherScheme = {
        appName: "E-Mail App",
        iosScheme: {
            scheme: "message://",
            storeUrl: "",
        },
        androidScheme: {
            scheme: "com.android.email||com.lenovo.email||com.google.android.gm",
            storeUrl: "",
        },
        wpScheme: "mail:"
    }

    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes)
        _paq.push(['trackEvent', 'Menu-Navigation', 'E-Mail gestartet']);
    }
}
