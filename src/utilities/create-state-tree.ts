import { getPage } from '../pages/index';
import { getModule } from '../modules/index';
import _ from 'lodash';

const allowedConfigKeys = [
    'module',
    'moduleData',
    'page',
    'pageData',
    'children'
];

export function createStateTree(stateConfig, transformOptions: any = {}) {
    // set the default page component
    const defaultPageComponent = transformOptions.defaultPage ?
        getPage(transformOptions.defaultPage) :
        getPage('OverviewPage');
    const defaultErrorPageComponent = getPage('ErrorPage');

    let stateTree = parseStateConfig(stateConfig, defaultPageComponent, defaultErrorPageComponent);

    return Promise.resolve(stateTree);
}


function parseStateConfig(stateConfig, defaultPageComponent, defaultErrorPageComponent) {
    let out = {},
        stateKeys = Object.keys(stateConfig);

    stateKeys.forEach((stateKey) => {
        let currentStateObj: any = _.pick(stateConfig[stateKey], allowedConfigKeys);

        let isModule: boolean = currentStateObj.hasOwnProperty('module') && currentStateObj.module !== '',
            isCustomPage: boolean = currentStateObj.hasOwnProperty('page'),
            hasChildren: boolean = currentStateObj.hasOwnProperty('children') && !!Object.keys(currentStateObj.children).length,
            isOverview: boolean = !isModule && hasChildren;

        // attache module component
        if (isModule) {
            try {
                currentStateObj.module = getModule(currentStateObj.module);
            } catch (e) {
                // if we can't get the module, log error and default to default page
                // TODO default to an error Page, or show Error popup
                currentStateObj.page = defaultErrorPageComponent;
                delete currentStateObj.module;
                console.error(e);
            }
            // no module defined
        } else {

            // is custom page defined?
            if (isCustomPage) {
                try {
                    currentStateObj.page = getPage(currentStateObj.page);
                } catch (e) {
                    // if we can't get the page, log error and default to default page
                    // TODO default to an error Page, or show Error popup
                    currentStateObj.page = defaultErrorPageComponent;
                    console.error(e);
                }

                // if not, use default page component - defaults to overview page
            } else {
                currentStateObj.page = defaultPageComponent;
            }

            // if there are children, recurse
            if (isOverview) {
                currentStateObj.children = parseStateConfig(currentStateObj.children, defaultPageComponent, defaultErrorPageComponent)
            }
        }

        // assign to outpu at stateKey
        out[stateKey] = currentStateObj;
    });

    return out;
}
