import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { IPageData } from '../shared-interfaces/data';
import { SoniaConfigService } from '../providers/sonia-config-service/index';


@Directive({
  selector: '[sonia-custom-toolbar]',
  host: {
    'class': 'sonia-toolbar'
  }
})
export class CustomToolbar implements OnInit {
  // input propterty - the key in colorConfig
  @Input('sonia-custom-toolbar') pageData: IPageData;

  // the toolbar-background element child of <ion-navbar>
  // we set the background color on this element to stay consistent with ionic
  tbgEl: any;
  tbgElSelector: string = '.toolbar-background';

  backgroundColor: string;
  textColor: string;

  constructor(
    public el: ElementRef
  ) { }

  ngOnInit() {
    this.tbgEl = this.el.nativeElement.querySelector(this.tbgElSelector);

    this.backgroundColor = SoniaConfigService.COLOR_CONFIG[this.pageData.pageColor];
    this.textColor = SoniaConfigService.COLOR_CONFIG[this.pageData.titleColor];

    // set the background color
    if (this.backgroundColor && this.tbgEl) {
      this.tbgEl.style.backgroundColor = this.backgroundColor;
      // if we don't find the ionic element, warn - to be ready for api changes
    } else {
      console.warn(`ToolbarBackgroundColor: could not find child element ${this.tbgElSelector} in directive host: `, this.el.nativeElement);
    }

    // set the text color of this element
    // all children should inherit the color prop. via css if necessary
    if (this.textColor) {
      this.el.nativeElement.style.color = this.textColor;
    }
  }
}
