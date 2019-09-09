import { Injectable } from '@angular/core';
import { CalendarEntry } from '../../modules/calendar/calendarEntry';
import { Calendar as OurCalendar } from '../../modules/calendar/index';
import { AuthenticationService } from '../../providers/authentication/authentication-service';
import { Calendar } from '@ionic-native/calendar';
import { arrayContains } from '../../utilities/array-contains';
import { DataService } from "../data-service/index";
import { Observable } from 'rxjs/Observable';


@Injectable()
export class CalendarImportService {

  private calendars: Array<any> = new Array<any>(10);
  private titles: Array<string> = new Array<string>();

  constructor(
    public calendar: Calendar,
    public authService: AuthenticationService,
    public dataService: DataService
  ) {
  }

  exportSoniaAppointmentToDevice(appointment: CalendarEntry) {
    //todo adapt time zone
    //new moment(something).add(10, 'm').toDate();
    this.calendar.createEventInteractively(appointment.title, appointment.location, appointment.description, new Date(appointment.start), new Date(appointment.end)).then((_success) => {
    },
      (error) => {
        console.log(error);
      });
  }

  importDeviceAppointments(start, end): Promise<Observable<any>> {
    this.getDeviceCalendars();
    this.getBackendAppointments();
    return new Promise<Observable<any>>((resolve, reject) => {
      //TODO make this rely on promises and not on timeout
      setTimeout(() => {
        for (var { } of this.calendars) {
        }
        this.calendar.listEventsInRange(start, end).then(
          (msg) => {
            resolve(this.returnRelevantEvents(msg));
          },
          (err) => {
            console.log(err);
            reject();
          }
        );
      }, 3000);
    });

  }

  getDeviceCalendars() {
    this.calendar.listCalendars().then(
      (msg) => {
        for (var entry of msg) {
          this.calendars[entry.id] = entry.name;
        }
      },
      (err) => { console.log(err); }
    );
  }

  getBackendAppointments() {
    OurCalendar.getRemoteData(this.dataService, this.authService, null).subscribe(success => {
      for (var appointment of success.data) {
        this.titles.push(appointment.title);
      }
    },
      error => {
        console.log(error);
      });
  }

  returnRelevantEvents(msg): Observable<any> {
    let observable = Observable.create(observer => {
      for (var entry of msg) {
        //TODO find more standard calendars that need to be ignored
        if (this.calendars[entry.calendar_id] !== "Week Numbers" && this.calendars[entry.calendar_id] !== "Feiertage in Deutschland" && this.calendars[entry.calendar_id] !== "Contacts") {
          //check if this date is alrdy loaded
          if (!(arrayContains(this.titles, entry.title))) {
            let appointment = new CalendarEntry();
            appointment.start = new Date(entry.dtstart).toISOString();
            appointment.end = new Date(entry.dtend).toISOString();
            appointment.title = entry.title;
            appointment.klient = {
              GGUID: this.authService.userCredentials.GGUID,
              displayname: this.authService.userCredentials.lastname
            };
            observer.next(appointment);
          }
        }
      }
      observer.complete();
    });
    return observable;
  }

}
