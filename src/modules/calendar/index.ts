import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, NavParams, NavController, AlertController } from 'ionic-angular';

import { ModuleBase } from '../module-base';
import { INavParams, IDetailNavParams, IRemoteData } from '../../shared-interfaces/data';
import { CalendarEntry } from './calendarEntry';
// customized Schedule Component of Primeng
import { Schedule } from '../../shared-components/schedule';

// sub pages
import { CalendarEditEntry } from './editEntry';
import { CalendarEntryDetail } from './entryDetail';
import { CalendarImportModule } from './import';

import { CalendarNewsStreamComponent } from './newsStreamComponent';
import { DataService } from '../../providers/data-service/index';
import { AuthenticationService } from '../../providers/authentication/authentication-service';
import { ConnectivityService } from '../../providers/connectivity/index';
import { LoginRedirectService } from '../../providers/authentication/login-redirect-service';
import { AppointmentRemoteService } from "../../providers/remote-services/appointment-remote-service";
import { AddressRemoteService } from "../../providers/remote-services/address-remote-service";
import { Observable } from 'rxjs/Observable';

/**
* All normal modules must extend ModuleBase and have to be
* decorated by @Page
**/
@Component({
  templateUrl: 'calendar.html'
})
export class Calendar extends ModuleBase implements OnInit {

  // get a refecrence to the plugin internal intance to trigger page changes
  @ViewChild(Schedule) scheduleDir: Schedule;
  // element instance to call jquery plugin directly
  schedule;
  height = "auto";
  locale = "de";

  needsAuth: boolean = true;
  loadingData: boolean = true;
  entries: Array<CalendarEntry> = [];

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
      this.updateEntries();
      this.updateTitle();
      this.scrollContent = this.schedule.closest('scroll-content').first();
      this.onResize();
    });
  }

  updateEntries() {
    this.loadingData = true;
    this.authService.initService().then(_init => {
      this.appointmentService.getAppointmentsOfUser(this.authService._userCredentials.GGUID).subscribe(appointments => {
        this.entries = [];
        for (var appointment of appointments) {
          let entry = new CalendarEntry(appointment);
          entry.adaptTimeForFullCalendar();
          if (!this.entriesContainAppointment(entry)) {
            this.entries.push(entry);
          }
        }
        this.addressService.getGroupsOfUser(this.authService._userCredentials.GGUID).subscribe(groups => {
          for (const group of groups) {
            this.appointmentService.getAppointmentsOfUser(group.GGUID).subscribe(appointments => {
              for (var appointment of appointments) {
                let entry = new CalendarEntry(appointment);
                entry.adaptTimeForFullCalendar();
                entry.isUserAppointment = false;
                entry.group = group.name;
                if (!this.entriesContainAppointment(entry)) {
                  this.entries.push(entry);
                }
              }
            });
          }
        });
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

  //<a class="fc-day-grid-event fc-h-event fc-event fc-start fc-not-end"><div class="fc-content"><span class="fc-time">10 - 12:30</span> <span class="fc-title">B.U.S. - Treffpunkt im Rauner</span></div></a>
  // <a class="fc-day-grid-event fc-h-event fc-event fc-start fc-end"><div class="fc-content"> <span class="fc-title">Der zweite Testeintrag im Kalender</span></div></a>
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
        data: entry
      }
    };
    this.nav.push(CalendarEntryDetail, params);
  }

  gotoCreate() {
    this.ensureIsOnline(this.alertController, this.connectivityService, _ => {
      // we don't send params.data to the edit page to signal
      // creation of a new entry
      if (this.isMonthView) {
        let params: IDetailNavParams = {
          pageData: this.pageData,
          moduleData: this.moduleData,
          params: null
        };
        this.nav.push(CalendarEditEntry, params);
      }
      else {
        let params: IDetailNavParams = {
          pageData: this.pageData,
          moduleData: this.moduleData,
          params: this.currentDate
        };
        this.nav.push(CalendarEditEntry, params);
      }
    });
  }

  goToImport() {
    // params.id specifies the entry to be shown
    let params: IDetailNavParams = {
      pageData: this.pageData,
      moduleData: this.moduleData,
      params: {
      }
    };
    this.nav.push(CalendarImportModule, params);
  }


  entriesContainAppointment(appointment){
    for (var entry of this.entries){
      if (entry.title == appointment.title && entry.start == appointment.start && entry.end == appointment.end){
        return true;
      }
    }
    return false;
  }

  /*******************
  * NewsStream interface
  *
  * these two methods must be implemented as static in order to register for
  * the NewsStreamService
  ********************/

  /**
  * responsible for querying remote data from the DataService
  * use this as single access point to the DataService - set up the modules query logic here
  *
  * @returns Observable<any> - so this module and the NewsStreamService can subscribe to it
  **/
  public static getRemoteData(dataService: DataService, authService: AuthenticationService, _navParams: INavParams): Observable<IRemoteData> {
    return dataService.getCalendarNews(authService._userCredentials.GGUID);
  }

  /**
  * @returns Component for single Entries of this modules data in the NewsStreamPage
          Component must expose attribute "displayData" as @Input
  **/
  public static getNewsStreamComponent() {
    return CalendarNewsStreamComponent;
  }
}

/***********************
* Module functions
************************/

/**
* map remote data format to usable format
*
* @param remoteEntries <Array | Object> - Data as received from backend
* @return <Array<CalendarEntry>>| CalendarEntry> - transformed data
**/
export function calendarEntryFactory(remoteEntries, currentUserGGUID): any {

  if (Array.isArray(remoteEntries)) {
    return remoteEntries.map(entry => transform(entry));
  } else {
    return transform(remoteEntries);
  }

  function transform(entry) {
    if (entry instanceof CalendarEntry) {
      return entry;
    } else {
      let data = entry;
      // currently logged in user is 'owner' of this appointment, if he is the 'Klient'
      data.isUserAppointment = (entry.klient && entry.klient.GGUID == currentUserGGUID);
      // TODO: what if a backend 'User' is logged in?
      let newEntry = new CalendarEntry(data);
      CalendarEntry.adaptTimeZone(newEntry)
      return newEntry;      
    }
  }
}
