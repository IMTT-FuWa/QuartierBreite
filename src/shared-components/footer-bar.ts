import { Component, Input, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IPageData } from '../shared-interfaces/data';

@Component({
    selector: 'sonia-footer-bar',
    template: `
        <ion-buttons>
            <button ion-button clear color="light" *ngIf="nav.length() > 1 && !pageData.hideHomeButton" (click)="onHomeBtnClick()">
                <ion-icon name="home"></ion-icon>
            </button>
        </ion-buttons>
    `
})

export class FooterBar implements OnInit {
    @Input() pageData: IPageData = {};

    constructor(public nav: NavController) { }

    ngOnInit() { }

    onHomeBtnClick() {
        this.nav.popToRoot();
    }
}
