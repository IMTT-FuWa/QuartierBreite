// import every known module
import { OverviewPage } from './overview-page/index';
import { ErrorPage } from './error-page/index';

// register the modules in the 'registry'
// we need this dictionary to check if if modules required by config files
// actually exist
const pages = {
  OverviewPage,
  ErrorPage
};


/**
* the getter method to recieve modules
*
* only this method should be used to import modules in other components of pages
**/
export function getPage(pageName) {
  if (pageExists(pageName)) {
    return pages[pageName];
  } else {
    // TODO tell app user that something went wrong!
    throw new Error(`Page loading error: Page ${pageName} was requested but was not found!`);
  }
}

function pageExists(pageName) {
  return pages.hasOwnProperty(pageName);
}
