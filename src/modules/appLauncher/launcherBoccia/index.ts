import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherBoccia extends ExternalModuleBase {

    /**
    * this should be configured to meet the apps expected identifiers
    **/
    schemes: IAppLauncherScheme = {
        appName: "Boccia 3D",
        iosScheme: {
            scheme: "boccefree://",
            storeUrl: "https://itunes.apple.com/de/app/bocce-3d-free/id779666176?mt=8",
        },
        androidScheme: {
            scheme: "com.giraffegames.bocce",
            storeUrl: "https://play.google.com/store/apps/details?id=com.giraffegames.bocce&hl=de",
        },
        wpScheme: "bocce:"
    }


    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes);
        _paq.push(['trackEvent', 'Menu-Navigation', 'Boccia 3D gestartet']);
    }
}
