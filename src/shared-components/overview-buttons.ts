import { Component, Input, OnInit } from '@angular/core';
import { IPageData } from '../shared-interfaces/data';
import { SmartAudio } from '../providers/smart-audio';
/**
* will display all <overview-button> according to supplied Config
* entry component vor pages that display links to child components/modules
*
**/
@Component({
    selector: 'sonia-overview-buttons',
    template: `
        <ion-row wrap class="sonia-overview-buttons-row">
            <ion-col class="sonia-overview-buttons-col" *ngFor="let config of overviewButtonConfigs">
                <sonia-overview-button [buttonConfig]="config" [defaultButtonColorKey]="pageColor" (click)="ButtonClick()">
                </sonia-overview-button>
            </ion-col>
        </ion-row>
    `,
    host: {
        class: 'sonia-overview-buttons-container'
    }
})

export class OverviewButtons implements OnInit {
    @Input() overviewButtonConfigs;
    @Input() pageData: IPageData;

    pageColor: string;

    constructor(private smartAudio: SmartAudio) { }

    ngOnInit() {
        this.pageColor = this.pageData.pageColor || "";
    }

    ButtonClick() {
        this.smartAudio.play('BtnClickSound');
    }
}
