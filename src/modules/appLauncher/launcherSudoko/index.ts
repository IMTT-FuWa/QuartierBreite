import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherSudoko extends ExternalModuleBase {

    /**
    * this should be configured to meet the apps expected identifiers
    **/
    schemes: IAppLauncherScheme = {
        appName: "Super Sudoku",
        iosScheme: {
            scheme: "x-mmggames-sudokufree://",
            storeUrl: "https://itunes.apple.com/in/app/sudoku-free/id285755462",
        },
        androidScheme: {
            scheme: "com.kiwifruitmobile.sudoku",
            storeUrl: "https://play.google.com/store/apps/details?id=com.kiwifruitmobile.sudoku&hl=de",
        },
        wpScheme: "sudoku:"
    }


    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes);
        _paq.push(['trackEvent', 'Menu-Navigation', 'Super Sudoku gestartet']);
    }
}
