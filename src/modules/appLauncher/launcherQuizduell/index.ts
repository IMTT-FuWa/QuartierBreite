import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherQuizduell extends ExternalModuleBase {

    /**
    * this should be configured to meet the apps expected identifiers
    **/
    schemes: IAppLauncherScheme = {
        appName: "Quizduell",
        iosScheme: {
            scheme: "fb462156333871013://",
            storeUrl: "https://itunes.apple.com/de/app/quizduell/id643791032?mt=8",
        },
        androidScheme: {
            scheme: "se.feomedia.quizkampen.de.lite",
            storeUrl: "https://play.google.com/store/apps/details?id=se.feomedia.quizkampen.de.lite&hl=de",
        },
        wpScheme: "quizduell:"
    }

    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes);
        _paq.push(['trackEvent', 'Menu-Navigation', 'Quizduell gestartet']);
    }
}
