import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { IPageData } from '../shared-interfaces/data';
import { SoniaConfigService } from '../providers/sonia-config-service/index';


@Directive({
  selector: '[sonia-custom-card]',
  host: {
    'class': 'sonia-card'
  }
})
export class CustomCard implements OnInit {
  // input propterty - the key in colorConfig
  @Input('sonia-custom-card') pageData: IPageData;

  cardHeaderEl: any;
  cardHeaderElSelector: string = 'ion-card-header';

  cardButtonEls: any;
  cardButtonElsSelector: string = '.sonia-card-button';

  pageColor: string;

  constructor(
    public el: ElementRef
  ) { }

  ngOnInit() {
    this.cardHeaderEl = this.el.nativeElement.querySelector(this.cardHeaderElSelector);
    this.cardButtonEls = this.el.nativeElement.querySelectorAll(this.cardButtonElsSelector);

    this.pageColor = SoniaConfigService.COLOR_CONFIG[this.pageData.pageColor];

    if (!this.cardHeaderEl) {
      console.warn(`CustomCard: could not find child element ${this.cardHeaderElSelector} in directive host: `, this.el.nativeElement);
    }

    // card title color
    if (this.cardHeaderEl && this.pageColor) {
      this.cardHeaderEl.style.color = this.pageColor;
    }

    // card buttons color
    if (this.cardButtonEls && this.pageColor) {
      Array.prototype.forEach.call(this.cardButtonEls, (button) => {
        button.style.backgroundColor = this.pageColor;
      });
    }
  }
}
