import { Component } from '@angular/core';

@Component({
  selector: 'sonia-item-row',
  template: `
        <div class="sonia-item-row-inner">
            <ion-row>
                <ng-content></ng-content>
            </ion-row>
        </div>
    `,
  host: {
    class: 'sonia-item-row'
  }
})

export class ItemRow {
  constructor() { }
}
