import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherGedaechnistraining extends ExternalModuleBase {

    /**
    * this should be configured to meet the apps expected identifiers
    **/
    schemes: IAppLauncherScheme = {
        appName: "Gehirntraining mit NeuroNation",
        iosScheme: {
            scheme: "neuronation://",
            storeUrl: "https://itunes.apple.com/de/app/neuronation-gehirnjogging/id821549680?mt=8",
        },
        androidScheme: {
            scheme: "air.nn.mobile.app.main",
            storeUrl: "https://play.google.com/store/apps/details?id=air.nn.mobile.app.main&hl=de",
        },
        wpScheme: "neuronation:"
    }

    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes);
        _paq.push(['trackEvent', 'Menu-Navigation', 'Gehirntraining gestartet']);
    }
}
