import { NavParams } from 'ionic-angular';
import { IPageData } from '../shared-interfaces/data';
import assign from 'lodash/assign';


export class PageBase {

  // default pageData values
  pageData: IPageData = {
    pageTitle: 'pageTitle is missing!',
    pageColor: 'defaultColor'   // key in colorConfig
  };

  constructor(params: NavParams) {
    this.pageData = assign(this.pageData, params.get('pageData') || {});
  }
}
