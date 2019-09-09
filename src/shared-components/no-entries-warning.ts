import { Component, Input } from '@angular/core';
import { ConnectivityService } from '../providers/connectivity/index';

/**
* shows spinner while entries are loaded
* if system is in offline mode, it shows a message, that no entries are foundOldEntry
*
* usecase: if online, show that remote entries are loaded. if we are offline,
* and no entires are in local storage yet, show warning message
**/

@Component({
  selector: 'sonia-no-entries-warning',
  template: `
        <div *ngIf="show">
            <h1>Keine Einträge gefunden</h1>
            <p *ngIf="!isOnline()">Sie müssen online sein, um erstmalige Daten zu empfangen</p>
        </div>
    `,
  host: {
    class: 'sonia-no-entries-warning'
  }
})

export class NoEntriesWarning {
  @Input() show: boolean;

  constructor(public connection: ConnectivityService) { }

  isOnline(): boolean {
    return this.connection.isOnline;
  }
}
