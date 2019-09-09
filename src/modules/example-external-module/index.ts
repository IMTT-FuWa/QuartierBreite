/****************************************************
*
* This Module serves as an example for all external modules
* i.e. all modules, that don't need a separate view/@Page
* but only call external functionality, like app launchers
* or external browsers
*
*****************************************************/

/**
* minimal imports
**/
import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../module-base';
import { LoginRedirectService } from '../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../providers/connectivity/index';

/**
* All external normal modules must extend ExternalModuleBase and have to be
* decorated by @Injectable
* also they must implement the abstract runExternal() method which gets
* invoked when navigating to this modules from overview pages
**/
@Injectable()
export class ExampleExternalModule extends ExternalModuleBase {


    /**
    * modules can specify, if auth is needed to use it
    * the parent class handles this. if auth is needed an user is not logged in,
    * he will be prompted to do so (via Alert) or cancel the usage
    **/
    needsAuth: boolean = true;

    /**
    **/
    constructor(lrService: LoginRedirectService, cnService: ConnectivityService) {
        super(lrService, cnService);
    }

    /**
    * each external module has to implement this abstract function
    * this gets called, if the module is run (i.e. by clicking on its overview
    * page button)
    **/
    runExternal() {
    }
}
