import { Component, Input } from '@angular/core';
import { ConnectivityService } from '../providers/connectivity/index';

/**
* shows spinner while entries are loaded
* or a message if offline
**/

@Component({
  selector: 'sonia-online-loading-indicator',
  template: `
        <div class="offline" *ngIf="!isOnline()">
            <span><em>Sie sind Offline</em></span>
        </div>
        <div class="loading" *ngIf="isOnline() && loading">
            <span>Lade neue Einträge </span>
            <ion-spinner name="circles"></ion-spinner>
        </div>
    `,
  host: {
    class: 'sonia-online-loading-indicator'
  }
})

export class OnlineLoadingIndicator {

  @Input() loading: boolean = true;

  constructor(public connection: ConnectivityService) { }

  isOnline(): boolean {
    return this.connection.isOnline;
  }
}
