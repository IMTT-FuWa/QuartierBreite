import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherMusic extends ExternalModuleBase {

  /**
  * this should be configured to meet the apps expected identifiers
  **/
  schemes: IAppLauncherScheme = {
    appName: "Musik",
    iosScheme: {
      scheme: "music://",
      storeUrl: "",
    },
    androidScheme: {
      scheme: "com.sec.android.app.music||com.google.android.music",
      storeUrl: "https://play.google.com/store/apps/details?id=com.google.android.music&hl=de",
    },
    wpScheme: "music:"
  }

  constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
    super(loginRedirectService, connectivityService);
  }

  runExternal() {
    this.launcher.launchApp(this.schemes);
    _paq.push(['trackEvent', 'Menu-Navigation', 'Musik gestartet']);
  }
}
