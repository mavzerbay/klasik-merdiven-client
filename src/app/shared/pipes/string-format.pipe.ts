import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringFormat'
})
export class StringFormatPipe implements PipeTransform {

  transform(value: string, ...args: any[]): string {
    return value.replace(/{(\d+)}/g, (match, num) => {
      return typeof args[num] !== 'undefined' ? args[num] : match;
    });
  }

}
