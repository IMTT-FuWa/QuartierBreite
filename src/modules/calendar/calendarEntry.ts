import * as moment from 'moment/moment';

export class CalendarEntry {

  id: string; // is set by server
  etag: string; // TODO abstract this away in a base class, since it will be required by all models
  createdAt: string; // is set by server
  title: string;
  start: string; // iso string "2016-08-10T09:00:00"
  end: string;
  allDay: boolean;
  recurse: boolean;
  recursionPattern: string;
  description: string;
  location: string;
  participants: Array<any>;
  klient: any; //Object
  isUserAppointment: boolean; // flag if this appointment belongs to current user or if he is participant
  group: string;

  constructor(data?: any) {
    if (data) {
      this.id = data.GGUID;
      this.etag = data.ETAG;
      this.createdAt = data.timestamp;
      this.title = data.title;
      this.start = data.startdate
      this.end = data.enddate;
      this.allDay = data.allDay;
      this.recurse = false;
      this.recursionPattern = null;
      this.description = data.description;
      this.location = data.location;
      this.participants = data.participants;
      this.klient = data.klient;
      this.isUserAppointment = data.isUserAppointment;
    } else {
      // prepopulate with default data
      // set start an end datetime to 'now'
      this.start = new Date().toISOString();
      this.end = new Date().toISOString();
      this.allDay = false;
      this.recurse = false;
      this.participants = [];
      this.isUserAppointment = true;
    }
  }

  public adaptTimeForFullCalendar() {
    let start = new Date(this.start);
    let end = new Date(this.end);
    //Don't forget to setup summer time (start, 1) and winter time (start, 2)
    start = CalendarEntry.addHours(start, 2);
    end = CalendarEntry.addHours(end, 2);
    this.start = start.toISOString();
    this.end = end.toISOString();
  }

  public convertToBackendAppointment(): any {
    let appointment = {};
    appointment["GGUID"] = this.id;
    appointment["timestamp"] = this.createdAt;
    appointment["ETAG"] = this.etag;
    appointment["title"] = this.title;
    appointment["startdate"] = this.start;
    appointment["enddate"] = this.end;
    appointment["allDay"] = this.allDay;
    // appointment["recurse"] = this.recurse;
    // appointment["recursionPattern"] = this.recursionPattern;
    appointment["description"] = this.description;
    appointment["location"] = this.location;
    let mappedParticipants = [];
    for (var participant of this.participants) {
      mappedParticipants.push({ GGUID: participant });
    }
    if (mappedParticipants.length > 0) {
      appointment["participants"] = mappedParticipants;
    }
    appointment["klient"] = this.klient;
    appointment["isUserAppointment"] = this.isUserAppointment;
    return appointment;
  }

  //Helper methods to convert between time zones

  public static addHours(date: Date, hours: number) {
    var m = moment(date);
    m.add("hours", hours);
    return m.toDate();
  }

  public static decHours(date: Date, hours: number) {
    var m = moment(date);
    m.subtract("hours", hours);
    return m.toDate();
  }

  public static formatDateAndTime(date: Date) {
    return date.toISOString();
  }

  public static adaptTimeZone(entry: CalendarEntry) {
    //TODO fix this when nudedian implemented ISO time standard
    entry.start = CalendarEntry.formatDateAndTime(CalendarEntry.addHours(new Date(entry.start), 2));
    entry.end = CalendarEntry.formatDateAndTime(CalendarEntry.addHours(new Date(entry.end), 2));
  }

  public static convertToTwoDigitFormat(x) {
    if (x < 10) {
      x = "0" + x;
    }
    return x;
  }
}
