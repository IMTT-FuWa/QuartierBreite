import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherDfunk extends ExternalModuleBase {

    /**
    * this should be configured to meet the apps expected identifiers
    **/
    schemes: IAppLauncherScheme = {
        appName: "Das DRadio",
        iosScheme: {
            scheme: "dasdradio://",
            storeUrl: "https://itunes.apple.com/us/app/das-dradio/id439874065?mt=8",
        },
        androidScheme: {
            scheme: "com.smartmobilefactory.deutschlandradio",
            storeUrl: "https://play.google.com/store/apps/details?id=com.smartmobilefactory.deutschlandradio&hl=de",
        },
        wpScheme: "dradio:"
    }


    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes);
        _paq.push(['trackEvent', 'Menu-Navigation', 'Das DRadio gestartet']);
    }
}
