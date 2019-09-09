import { Injectable } from '@angular/core';
import { INavParams } from '../../shared-interfaces/data';
import { DataService } from '../../providers/data-service/index';
import { AuthenticationService } from '../../providers/authentication/authentication-service';
import { Observable } from 'rxjs/Observable';


/**
* pulic interface for single access to each registered module
* we introduce this to hide regsitration implementation details and keep the
* accessor interface consistent
**/
export interface NewsRegistrationAccessor {
    moduleTitle: string;
    navParams: INavParams;
    data: Observable<any>;
    templateComponent;
}

/**
* internal interface
**/
export interface NewsModuleRegistration {
    getRemoteData(dataService: DataService, authService: AuthenticationService, navParams: INavParams): Observable<any>;
    navParams: INavParams;
    templateComponent;
}

@Injectable()
export class NewsStreamService {

    registeredModules: Array<NewsModuleRegistration> = [];

    constructor(
        public dataService:DataService,
        public authService: AuthenticationService
    ) {
    }

    /**
    * register the Modules that should display their data in the newsstream
    *
    * TODO documentation!
    * @param moduleDefinitions:Array<Object>
    *           each object in the Array should provide:
    *            - the module class implementing two static methods:
    *                - getRemoteDate(): returns Observable for the remote data of this module
    *                - getNewsStreamComponent(): returns the component to be used in the newsStream layout
    *            - moduleData: the module config data provided in stateConfig.json
    *            - pageData (optional): the page config data provided in stateConfig.json
    **/
    registerModules(moduleDefinitions: Array<any>): void {
        this.registeredModules = [];
        moduleDefinitions.forEach((md) => { this.registerModule(md) });
    }

    public registerModule(moduleDefinition) {
        /**
        * check if the expected static methods are implemented on the module
        **/
        let module = moduleDefinition.module,
            error: string = '';

        if (!module.hasOwnProperty('getRemoteData') || typeof module.getRemoteData !== 'function') {
            error = 'NewsStreamService: a module tries to register for NewsStreamService but is missing an implementation for static method "getRemoteData". \n';
        }
        if (!module.hasOwnProperty('getNewsStreamComponent') || typeof module.getNewsStreamComponent !== 'function') {
            error += 'NewsStreamService: a module tries to register for NewsStreamService but is missing an implementation for static method "getNewsStreamComponent". \n';
        }

        // if we have errors, skip registration of this module
        if (error) {
            console.warn(error + ' | MODULE IS NOT REGISTERED! : ', moduleDefinition);
            return;
        }

        // no errors, register the module
        let registration: NewsModuleRegistration = {
            getRemoteData: module.getRemoteData,
            navParams: {
                pageData: moduleDefinition.pageData,
                moduleData: moduleDefinition.moduleData
            },
            templateComponent: module.getNewsStreamComponent()
        }

        this.registeredModules.push(registration);
    }

    // for each registration
    // return an object
    // that returns an observable for the data-query, so newsStreamPage can subscribe manually
    // and that return the template ref
    getRegistrations(): Array<NewsRegistrationAccessor> {
        let NewsRegistrationAccessors: Array<NewsRegistrationAccessor>;
        NewsRegistrationAccessors = this.registeredModules.map(reg => {
            return {
                moduleTitle: reg.navParams.pageData.pageTitle || '',
                navParams: reg.navParams,
                data: reg.getRemoteData(this.dataService, this.authService, reg.navParams),
                templateComponent: reg.templateComponent
            };
        });

        return NewsRegistrationAccessors;
    }


}
