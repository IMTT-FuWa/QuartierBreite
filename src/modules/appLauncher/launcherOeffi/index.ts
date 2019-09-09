import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherOeffi extends ExternalModuleBase {

    /**
    * this should be configured to meet the apps expected identifiers
    **/
    schemes: IAppLauncherScheme = {
        appName: "Öffi - Fahrplanauskunft",
        iosScheme: {
            scheme: "oeffi://",
            storeUrl: "https://itunes.apple.com/de/app/fahrplan/id284970116?mt=8",
        },
        androidScheme: {
            scheme: "de.schildbach.oeffi",
            storeUrl: "https://play.google.com/store/apps/details?id=de.schildbach.oeffi&hl=de",
        },
        wpScheme: "oeffi:"
    }

    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes);
        _paq.push(['trackEvent', 'Menu-Navigation', 'Öffi - Fahrplanauskunft gestartet']);
    }
}
