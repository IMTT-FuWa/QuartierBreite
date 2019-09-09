import { Pipe, PipeTransform } from '@angular/core';
import Moment from 'moment';
// import * as moment from 'moment/moment';

// set the moment.js german localization globally
import 'moment/locale/de';
Moment.locale('de');

@Pipe({
  name: 'momentDate',
  pure: true
})
export class MomentDatePipe implements PipeTransform {

  /**
  * TODO add formats as needed
  **/

  // mapping table to match moment.js format strings
  static _ALIASES: { [key: string]: String } = {
    'longDate': 'dddd, DD. MMMM YYYY',
    'mediumDate': 'DD. MMMM YYYY',
    'mediumTime': 'HH:mm',
    'day': 'dddd'
  };
  //2 in the end of format indiciates that current date becomes "Heute", e.g. "mediumDate2"
  //Timezone in the end of date format indicates that our time zone is considered (+1hour)
  //Timezone must come after 2 if both are used, e.g. "mediumTime2Timezone"


  //TODO adapt to winter/summer time logic
  adaptTimeZone(date: Date): Date {
    // var m = moment(date);
    // m.add("hours", 2);
    // return m.toDate();
    return date;
  }

  transform(value: any, format?: string): string {

    if (value == "" || value == " ") return null;
    if (!this.supports(value)) {
      console.warn("MomentDatePipe: Input value must be a Date instance", value);
    }

    // if we didn't get a Date object but is number string,
    // create a Date object
    // let date: Date = isDate(value) ? <Date>value : new Date(value);
    let date: Date = new Date(value);
    if (format.endsWith("Timezone")) {
      date = this.adaptTimeZone(date);
      format = format.substring(0, format.length - 8);
    }

    if (format.endsWith("2")) {
      if (new Date().toDateString() == date.toDateString()) {
        return "Heute";
      }
      else {
        format = format.substring(0, format.length - 1);
      }
    }

    let formatString: string;
    // set a default pattern string from the aliases map

    let pattern: string = format !== null ? format : 'mediumDate';
    // if the provided string is found in the alias map, use it
    if (MomentDatePipe._ALIASES[pattern]) {
      formatString = <string>MomentDatePipe._ALIASES[pattern];
    } else {
      console.warn("MomentDatePipe: format alias not found: " + pattern);
      return null;
    }

    /**
    * TODO ignoring Timezone for now -- will it be set by server?
    **/
    // let moment = Moment.utc(date);
    let moment = Moment(date);
    let transformed: string = moment.format(formatString);

    return transformed;
  }

  // supports(obj: any): boolean { return isDate(obj) || (obj instanceof String) || ((typeof obj)=="string") }
  supports(obj: any): boolean { return (obj instanceof Date) || (obj instanceof String) || ((typeof obj) == "string") }
}
