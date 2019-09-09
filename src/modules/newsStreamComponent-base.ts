import { ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { INavParams } from '../shared-interfaces/data';
import { SoniaConfigService } from '../providers/sonia-config-service/index';
import { Http } from '@angular/http';

export class NewsStreamComponentBase {
  // placeholder props - must be implemented as @Input() in exteding component
  displayData;
  navParams: INavParams;

  moduleColor: string;
  moduleMarker;
  // soniaConfig: SoniaConfigService;

  constructor(public nav: NavController, public el: ElementRef, public http: Http) {
    // always use the root nav if we ndavigate from NewsStreamComponents
    // because we are running them inside the tabs-navController on the homepage
    // this.soniaConfig = new SoniaConfigService(http);
  }

  ngAfterViewInit() {
    // set the marker color
    // this.soniaConfig.initConfig().then(x => {
    this.moduleColor = SoniaConfigService.COLOR_CONFIG[this.navParams.pageData.pageColor];
    this.moduleMarker = this.el.nativeElement.querySelector('.sonia-news-stream-entry-marker');

    if (this.moduleColor && this.moduleMarker) {
      this.moduleMarker.style.backgroundColor = this.moduleColor;
    } else {
      console.warn('NewsStreamComponentBase: Could not set marker color for newsStreamComponent: ', this);
    }
    // });

  }
}
