import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherGalery extends ExternalModuleBase {
    /**
    * this should be configured to meet the apps expected identifiers
    **/
    schemes: IAppLauncherScheme = {
        appName: "Foto Galerie",
        iosScheme: {
            scheme: "photos-redirect://",
            storeUrl: "",
        },
        androidScheme: {
            scheme: "com.sec.android.gallery3d||com.lenovo.scgqc||com.google.android.apps.photos",
            storeUrl: "",
        },
        wpScheme: "gallery:"
    }

    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        this.launcher.launchApp(this.schemes);
        _paq.push(['trackEvent', 'Menu-Navigation', 'Foto Galerie gestartet']);
    }
}
