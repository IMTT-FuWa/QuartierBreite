import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherLibrivox extends ExternalModuleBase {

    /**
    * this should be configured to meet the apps expected identifiers
    **/
    schemes: IAppLauncherScheme = {
        appName: "LibriVox Hörbücher",
        iosScheme: {
            scheme: "librivox://",
            storeUrl: "https://itunes.apple.com/gb/app/librivox-audio-books/id596159212?mt=8",
        },
        androidScheme: {
            scheme: "biz.bookdesign.librivox",
            storeUrl: "https://play.google.com/store/apps/details?id=biz.bookdesign.librivox&hl=de",
        },
        wpScheme: "librivox:"
    }

    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes);
        _paq.push(['trackEvent', 'Menu-Navigation', 'LibriVox Hörbücher gestartet']);
    }
}
