import { Component, Input } from '@angular/core';
import { ConnectivityService } from '../providers/connectivity/index';

/**
* shows spinner while entries are loaded
* or a message if offline
**/

@Component({
  selector: 'sonia-online-loading-indicator-large',
  template: `
        <div class="offline" *ngIf="!isOnline()">
            <p><em>Sie sind Offline</em></p>
        </div>
        <div class="loading" *ngIf="isOnline() && loading">
            <p>Lade Einträge...</p>
            <ion-spinner name="circles"></ion-spinner>
        </div>
    `,
  host: {
    class: 'sonia-online-loading-indicator-large'
  }
})

export class OnlineLoadingIndicatorLarge {

  @Input() loading: boolean = true;

  constructor(public connection: ConnectivityService) { }

  isOnline(): boolean {
    return this.connection.isOnline;
  }
}
