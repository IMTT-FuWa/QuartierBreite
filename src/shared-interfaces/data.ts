/**
* describes properties of 'pageData' objects in the stateTree/state config
**/
export interface IPageData {
  pageTitle?: string;
  pageColor?: string;
  titleColor?: string;
  hideHomeButton?: boolean;
}

/**
* describes properties of 'moduleData' objects in the stateTree/state config
**/
export interface IModuleData {
  externalUrl?: string;
  rssUrl?: string;
  exposeToNewsStream?: boolean;
}

/**
* describes properties of 'NavParams' that are passed to pages or modules
* when navigating.
**/
export interface INavParams {
  pageData: IPageData,
  moduleData: IModuleData
}

/**
* extends INavParams to transport additional 'content' data, eg for detail pages, that
* don't want to re-download the data
**/
export interface IDetailNavParams extends INavParams {
  params: INavParamsData;
}
export interface INavParamsData {
  id?: string | number;
  data?: any;
}

/**
* Interface for the global AppConfig, parsed from external JSON config files
**/
export interface IRemoteConfigKeys {
  appSettings?: string | any[];
  stateTree?: string | any[];
  overviewButtonConfig?: string | any[];
  colorConfig?: string | any[];
}




/**
* Wrapper for remote data
* the data service can signal if loaded data was received from local storage
* (IRemoteDataMeta.loadingFinished == false) contains the actual remote data (true)
**/
export interface IRemoteData {
  meta: IRemoteDataMeta;
  data: any;
}

export interface IRemoteDataMeta {
  isRemoteData: boolean;
}



/**
* Interface for app launcher scheme declarations (i.e. wich platforms are supported in this objects)
**/
export interface IAppLauncherScheme {
  appName: string;
  iosScheme?: IAppLauncherSchemeDetails;
  androidScheme?: IAppLauncherSchemeDetails;
  wpScheme?: string;
}

export interface IAppLauncherSchemeDetails {
  storeUrl?: string;
  scheme?: string;
  intentSetAction?: string;
  intentURI?: string;
}

/**
* Interface for emergencyEmail launcher parameter declarations
**/
export interface IEmergencyEmail {
  to?: string | Array<string>;
  subject?: string;
  body?: string;
  cc?: string | Array<string>;
  bcc?: string | Array<string>;
}
