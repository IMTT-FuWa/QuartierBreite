import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherPlaner extends ExternalModuleBase {

    /**
    * this should be configured to meet the apps expected identifiers
    **/
    schemes: IAppLauncherScheme = {
        appName: "Memo",
        iosScheme: {
            scheme: "Inkpad://",
            storeUrl: "https://itunes.apple.com/us/app/inkpad-notepad-notes-to-do/id992332888?mt=8",
        },
        androidScheme: {
            scheme: "com.workpail.inkpad.notepad.notes",
            storeUrl: "https://play.google.com/store/apps/details?id=com.workpail.inkpad.notepad.notes&hl=de",
        },
        wpScheme: "memo:"
    }

    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes);
        _paq.push(['trackEvent', 'Menu-Navigation', 'Memo Notepad gestartet']);
    }
}
