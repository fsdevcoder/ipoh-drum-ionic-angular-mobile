import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myCurrency'
})
export class MyCurrencyPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!args) {
      return value;
    }
    if (!value) {
      return 'RM0.00';
    }
    let priceFormat = '';
    let formattedPrice = 'RM ';
    priceFormat = value.toString().split('.');
    formattedPrice += priceFormat[0] + '.';
    if (priceFormat[1]) {
      formattedPrice += priceFormat[1];
      if (priceFormat[1].length === 1) {
        formattedPrice += '0';
      }
    } else {
      formattedPrice += '00';
    }
    return formattedPrice;
  }
}
