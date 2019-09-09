import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linebreak',
})
export class LineBreakPipe implements PipeTransform {

  transform(value: string) {
    if (value) {
      return value.replace(new RegExp('\n', 'g'), "<br />");
    } else {
      return "";
    }
  }
}