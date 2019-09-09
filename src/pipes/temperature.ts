import { Pipe, Injectable } from '@angular/core';

@Pipe({
  name: 'temperature'
})
@Injectable()
export class TemperaturePipe {

  transform(value: string) {
    var c = Math.round(parseInt(value, 10) - 273.15);
    //var f = Math.round(parseInt(value,10) * 9/5 - 459.67);
    return `${c} °C`;
  }


}
