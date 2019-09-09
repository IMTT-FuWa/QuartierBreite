import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { SoniaConfigService } from '../providers/sonia-config-service/index';

@Directive({
  selector: '[sonia-toolbarBackgroundColor]'
})
export class ToolbarBackgroundColor implements OnInit {
  // input propterty - the key in colorConfig
  @Input('sonia-toolbarBackgroundColor') colorKey: string;

  // the toolbar-background element child of <ion-navbar>
  // we set the background color on this element to stay consistent with ionic
  tbgEl: any;
  tbgElSelector: string = '.toolbar-background';
  backgroundColor: string;

  constructor(
    public el: ElementRef
  ) { }

  ngOnInit() {
    this.tbgEl = this.el.nativeElement.querySelector(this.tbgElSelector);
    this.backgroundColor = SoniaConfigService.COLOR_CONFIG[this.colorKey];

    if (this.tbgEl) {
      this.tbgEl.style.backgroundColor = this.backgroundColor;
      // if we don't find the ionic element, warn - to be ready for api changes
    } else {
      console.warn(`ToolbarBackgroundColor: could not find child element ${this.tbgElSelector} in directive host: `, this.el.nativeElement);
    }
  }
}
