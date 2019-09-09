import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LaunchSkypeCall extends ExternalModuleBase {

    /**
    * this should be configured to meet the apps expected identifiers
    **/
    schemes: IAppLauncherScheme = {
        appName: "Skype",
        iosScheme: {
            scheme: "skype://",
            storeUrl: "https://itunes.apple.com/de/app/skype-fur-iphone/id304878510?mt=8",
            intentSetAction: "ACTION_VIEW",
            intentURI: "skype:rgundogdu?call",
        },
        androidScheme: {
            scheme: "com.skype.raider",
            storeUrl: "https://play.google.com/store/apps/details?id=com.skype.raider&hl=de",
            intentSetAction: "ACTION_VIEW",
            intentURI: "skype:rgundogdu?call&video=true",
        },
        wpScheme: "skype:"
    }

    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes);
        _paq.push(['trackEvent', 'Menu-Navigation', 'Skype Direktwahl gestartet']);
    }
}
