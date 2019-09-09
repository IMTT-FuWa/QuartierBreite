import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, NavParams, NavController, AlertController } from 'ionic-angular';

import { ModuleBase } from '../module-base';
import { IDetailNavParams } from '../../shared-interfaces/data';
import { ResourceCalendarEntry } from './resourceCalendarEntry';
// customized Schedule Component of Primeng
import { Schedule } from '../../shared-components/schedule';

// sub pages
import { ResourceCalendarEditEntry } from './resourceCalendarEditEntry';
import { ResourceCalendarEntryDetail } from './resourceCalendarEntryDetail';

import { DataService } from '../../providers/data-service/index';
import { AuthenticationService } from '../../providers/authentication/authentication-service';
import { ConnectivityService } from '../../providers/connectivity/index';
import { LoginRedirectService } from '../../providers/authentication/login-redirect-service';
import { AppointmentRemoteService } from "../../providers/remote-services/appointment-remote-service";
import { AddressRemoteService } from "../../providers/remote-services/address-remote-service";

/**
* All normal modules must extend ModuleBase and have to be
* decorated by @Page
**/
@Component({
  templateUrl: 'resourcecalendar.html'
})
export class ResourceCalendar extends ModuleBase implements OnInit {

  // get a refecrence to the plugin internal intance to trigger page changes
  @ViewChild(Schedule) scheduleDir: Schedule;
  // element instance to call jquery plugin directly
  schedule;
  height = "auto";
  locale = "de";

  needsAuth: boolean = true;
  loadingData: boolean = false;
  entries: Array<ResourceCalendarEntry> = [];
  public resources = [];
  public selectedResource;

  // config params for the pluging
  scheduleHeaderConfig;

  DAY_VIEW: string = 'basicDay'; //agendaDay
  WEEK_VIEW: string = 'agendaWeek'; //agendaDay
  MONTH_VIEW: string = 'month';
  currentTitle: string;
  currentDate: any;
  isMonthView: boolean = true;

  scrollContent;
  currentViewHeight: number;

  constructor(
    public params: NavParams,
    public nav: NavController,
    public alertController: AlertController,
    public authService: AuthenticationService,
    public dataService: DataService,
    public connectivityService: ConnectivityService,
    public platform: Platform,
    public loginRedirectService: LoginRedirectService,
    public appointmentService: AppointmentRemoteService,
    public addressService: AddressRemoteService
  ) {
    super(params, nav, loginRedirectService);
  }

  ionViewCanEnter(): Promise<void> {
    return super.ionViewCanEnter();
  }

  ionViewWillEnter() {
    // _paq.push(['trackPageView', 'Calendar']);
    this.authService.initService().then(_credentials => {
      this.addressService.getResources(this.authService.userCredentials.GGUID).subscribe(resources => {
        this.resources = resources;
      });
    });
  }

  ngOnInit() {
    // this.scheduleHeaderConfig = {
    //   left: 'prev,next today',
    //   center: 'title',
    //   right: 'month,agendaWeek,agendaDay'
    // };
    this.scheduleHeaderConfig = false;
  }

  // OLD ngAfterViewInit() {
  // start binding to plugin just after view is entered
  // to prevent errors if authentication prompt is shown
  ionViewDidEnter() {
    this.schedule = this.scheduleDir.schedule;
    // populate data after dom is ready
    this.platform.ready().then(() => {
      // this.showToday();
      this.updateTitle();
      if (this.selectedResource) {
        this.updateEntries();
      }
      this.scrollContent = this.schedule.closest('scroll-content').first();
      this.onResize();
    });
  }

  updateEntries() {
    this.loadingData = true;
    this.authService.initService().then(_init => {
      this.appointmentService.getAppointmentsByResource(this.selectedResource).subscribe(appointments => {
        this.entries = [];
        for (var appointment of appointments) {
          let entry = new ResourceCalendarEntry(appointment);
          entry.adaptTimeForFullCalendar();
          if (!this.entriesContainAppointment(entry)) {
            this.entries.push(entry);
          }
        }
        this.loadingData = false;
      });
    });
  }

  /**
  * schedule internal navigation
  **/
  showToday() {
    this.schedule.fullCalendar('today');
    this.updateTitle();
  }

  showNext() {
    this.schedule.fullCalendar('next');
    this.updateTitle();
  }

  showPrev() {
    this.schedule.fullCalendar('prev');
    this.updateTitle();
  }

  dayView(date?) {
    this.schedule.fullCalendar('changeView', this.DAY_VIEW);
    if (date) {
      this.schedule.fullCalendar('gotoDate', date);
    }
    this.updateTitle();
    this.isMonthView = false;
  }

  weekView(date?) {
    this.schedule.fullCalendar('changeView', this.WEEK_VIEW);
    if (date) {
      this.schedule.fullCalendar('gotoDate', date);
    }
    this.updateTitle();
    this.isMonthView = false;
  }

  monthView() {
    this.schedule.fullCalendar('changeView', this.MONTH_VIEW);
    this.updateTitle();
    this.isMonthView = true;
  }

  onDayClick(event) {
    if (event.view.name == this.MONTH_VIEW || event.view.name == this.WEEK_VIEW) {
      this.dayView(event.date._d);
    }
  }

  onWeekClick() {
    // if (event.view.name == this.MONTH_VIEW) {
    this.weekView();
    // }
  }

  onEntryClick(event) {
    if (event.view.name == this.MONTH_VIEW || event.view.name == this.WEEK_VIEW) {
      this.dayView(event.calEvent.start._d);
    } else if (event.view.name == this.DAY_VIEW) {
      this.goToDetail(event.calEvent);
    }
  }

  /**
  * Layout adaption
  **/
  updateTitle() {
    this.currentTitle = this.schedule.fullCalendar('getView').title;
    this.currentDate = this.schedule.fullCalendar('getView').start._d;
  }

  onResize() {
    this.currentViewHeight = this.scrollContent.height();
    this.schedule.fullCalendar('option', 'contentHeight', this.currentViewHeight);
  }

  onEventRender(event, element, view) {
    element.addClass('sonia-schedule-event');
    // mark external events
    if (!event.isUserAppointment) {
      element.addClass('sonia-schedule-event-external');
    }

    if (view.type == 'basicDay') {
      // customize time display
      let time: string = "";//let timeContainer = element.find('.fc-time') || element.find('.fc-content').prepend('<span class="fc-time"></span>');
      if (event.allDay) {
        time = '<em>ganztägig</em>';
        element.find('.fc-content').prepend('<span class="fc-time">' + time + '</span>');
      } else {
        if (event.start) {
          time += event.start.format('HH:mm');
        }
        if (event.end) {
          time += ' bis ' + event.end.format('HH:mm');
        }
        if (time) {
          time += ' Uhr';
        }
        element.find('.fc-time').html(time);
      }
    }
  }

  /**
  * Page navigation
  **/
  goToDetail(entry) {
    if (!entry.id) {
      console.error('Calendar - Error: trying to show entry details, but entry data doesn not specify an unique id');
      return;
    }

    // params.id specifies the entry to be shown
    let params: IDetailNavParams = {
      pageData: this.pageData,
      moduleData: this.moduleData,
      params: {
        id: entry.id,
        data: { entry: entry, selectedResource: this.selectedResource }
      }
    };
    this.nav.push(ResourceCalendarEntryDetail, params);
  }

  gotoCreate() {
    this.ensureIsOnline(this.alertController, this.connectivityService, _ => {
      // we don't send params.data to the edit page to signal
      // creation of a new entry
      if (this.isMonthView) {
        let params: IDetailNavParams = {
          pageData: this.pageData,
          moduleData: this.moduleData,
          params: { data: { selectedResource: this.selectedResource } }
        };
        this.nav.push(ResourceCalendarEditEntry, params);
      }
      else {
        let params: IDetailNavParams = {
          pageData: this.pageData,
          moduleData: this.moduleData,
          params: { data: { date: this.currentDate, selectedResource: this.selectedResource } }
        };
        this.nav.push(ResourceCalendarEditEntry, params);
      }
    });
  }


  entriesContainAppointment(appointment) {
    for (var entry of this.entries) {
      if (entry.title == appointment.title && entry.start == appointment.start && entry.end == appointment.end) {
        return true;
      }
    }
    return false;
  }
}


