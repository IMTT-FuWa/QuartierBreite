import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxWordCount',
  pure: true
})
export class MaxWordCountPipe implements PipeTransform {

  transform(value: string, args: any): string {

    if (value == null || value == "" || value == " ") return null;
    //in case a single number instead of array is given
    if (args instanceof Number) {
      args = [args];
    }
    let defaultWordCount: number = 30,
      wordCount: number = args[0] || defaultWordCount;

    let words: Array<string> = value.split(' ');
    words = words.slice(0, wordCount).concat(['\u2026']); // add ellipses ...

    return words.join(' ');
  }


}
