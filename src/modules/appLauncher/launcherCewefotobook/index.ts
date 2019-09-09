import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherCewefotobook extends ExternalModuleBase {

    /**
    * this should be configured to meet the apps expected identifiers
    **/
    schemes: IAppLauncherScheme = {
        appName: "Cewe Fotowelt",
        iosScheme: {
            scheme: "cewe-fotowelt://",
            storeUrl: "https://itunes.apple.com/de/app/cewe-fotowelt-fotoprodukte-gestalten-bestellen/id583713833?mt=8",
        },
        androidScheme: {
            scheme: "de.worldiety.photiety.cewe.mc.de",
            storeUrl: "https://play.google.com/store/apps/details?id=de.worldiety.photiety.cewe.mc.de&hl=de",
        },
        wpScheme: "cewe-fotowelt:"
    }

    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes);
        _paq.push(['trackEvent', 'Menu-Navigation', 'Cewe Fotowelt gestartet']);
    }
}
