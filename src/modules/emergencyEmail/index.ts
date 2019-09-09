import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../module-base';
import { EmergencyEmailService } from '../../providers/EmailComposer/index';
import { IEmergencyEmail } from '../../shared-interfaces/data';
import { LoginRedirectService } from '../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LaunchEmergencyEmail extends ExternalModuleBase {

    constructor(lrService: LoginRedirectService, cnService: ConnectivityService, public emailLauncher: EmergencyEmailService) {
        super(lrService, cnService);
    }

    runExternal() {
        let config: IEmergencyEmail =
            {
                to: 'email@email.net',
                subject: 'Hilfe!',
                body: 'Bitte helfen Sie mir!'
            };

        this.emailLauncher.launchEmergencyEmail(config);
        _paq.push(['trackEvent', 'Menu-Navigation', ' ServicePunkt-Notmail gestartet']);
    }

}
