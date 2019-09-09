import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { IAppLauncherScheme } from '../../../shared-interfaces/data';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherARD extends ExternalModuleBase {

  /**
  * this should be configured to meet the apps expected identifiers
  **/
  schemes: IAppLauncherScheme = {
    appName: "ARD Mediathek",
    iosScheme: {
      scheme: "mediathek://",
      storeUrl: "https://itunes.apple.com/de/app/ard/id981496660?mt=8",
    },
    androidScheme: {
      scheme: "de.swr.avp.ard",
      storeUrl: "https://play.google.com/store/apps/details?id=de.swr.avp.ard&hl=de",
    },
    wpScheme: "music:"
  }

  constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService) {
    super(loginRedirectService, connectivityService);
  }

  runExternal() {
    this.launcher.launchApp(this.schemes);
    _paq.push(['trackEvent', 'Menu-Navigation', 'ARD Mediathek gestartet']);
  }
}
