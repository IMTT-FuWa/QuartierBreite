import { Component, Input, OnInit } from '@angular/core';
import { ComponentFactoryResolver, ComponentRef, ViewContainerRef, ViewChild } from '@angular/core';
import { INavParams, IRemoteData } from '../../shared-interfaces/data';
import { NewsRegistrationAccessor } from '../../providers/news-stream/index';
import { DataEntryUtils } from '../../utilities/data-utils';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'sonia-news-stream-section',
  template: `
        <ion-card text-wrap>
            <ion-card-header #sectionHeader>
                <strong>{{sectionTitle}} Neuigkeiten</strong>
                <sonia-online-loading-indicator [loading]="loadingData"></sonia-online-loading-indicator>
            </ion-card-header>
            <sonia-no-entries-warning [show]="!entries || !entries.length">
            </sonia-no-entries-warning>
        </ion-card>
    `,
  host: {
    class: 'sonia-card sonia-news-stream-section'
  }
})

export class NewsStreamSectionComponent implements OnInit {
  // input attribute for the module registration for this section
  @Input() moduleRegistration: NewsRegistrationAccessor;
  @Input() numberOfEntries: number;
  @Input() sortByDateProperty: string;
  // the container append the entries to
  @ViewChild('sectionHeader', { read: ViewContainerRef }) sectionHeader: ViewContainerRef;

  // currently displayed ComponentRefs in the list
  currentListComponents: Array<ComponentRef<any>> = [];
  // Observable for the list of all entries for this section (i.e. all news entries for one module)
  displayData: Observable<IRemoteData>;
  // the component reference for each of the entries
  templateComponent;
  navParams: INavParams;
  sectionTitle: string;

  // the list entries, after the displayData observable resolves
  // these get passed to the templateComponents
  entries: Array<any>;

  // true if remote data is still beeing loaded
  loadingData: boolean = true;

  constructor(public resolver: ComponentFactoryResolver) { }

  ngOnInit() {

    this.displayData = this.moduleRegistration.data;
    this.templateComponent = this.moduleRegistration.templateComponent;
    this.navParams = this.moduleRegistration.navParams;
    this.sectionTitle = this.moduleRegistration.moduleTitle;

    this.getData();
  }

  getData() {
    this.displayData.subscribe(
      // we got the data, update the entries and create the list components
      (response) => {
        // just show local data, if remote data has not been displayed yet
        if (this.loadingData) {
          if (response.meta.isRemoteData) {
            this.loadingData = false;
          }
          this.entries = response.data;
          this.updateList();
        }
      },
      (_error) => { console.error('NewsStreamSectionComponent - Error: data for ' + this.sectionTitle + ' could not be resolved'); }
    )
  }

  updateList() {
    // NOTE: we get an empty array from DataService if:
    // - locale store was not populated by online activities before
    // .....
    //filter out entries without date
    for (var i = 0; i < this.entries.length; i++) {
      if (this.entries[i].createdAt == null || this.entries[i].createdAt == "") {
        this.entries.splice(i, 1);
      }
    }
    // sort entries to show
    let showEntries: Array<any> = DataEntryUtils.sortDataEntriesByDate(this.entries, this.sortByDateProperty);
    // just show certain number of entries
    showEntries = DataEntryUtils.getFirstOfDataEntries(showEntries, this.numberOfEntries);

    // if list elements are displayed already, i.e. from offline storage
    // destroy them to get updated data in new components
    if (this.currentListComponents && this.currentListComponents.length) {
      this.currentListComponents.forEach(ref => ref.destroy());
    }

    // show new entries
    showEntries.forEach(entry => {
      // resolve the templateComponents and add them to the listContainer
      let componentFactory = this.resolver.resolveComponentFactory(this.templateComponent);
      let ref: ComponentRef<any> = this.sectionHeader.createComponent(componentFactory);
      // and pass the data to them.
      ref.instance.displayData = entry;
      // .. and the navParams to navigate to the entry detail
      ref.instance.navParams = this.navParams;
      this.currentListComponents.push(ref);
    });
  }
}
