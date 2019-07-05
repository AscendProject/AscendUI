import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: "orderby"
})
export class OrderByPipe {
  transform(array: Array<string>, args: string): Array<string> {
    console.log(array + "---->" + args);
    array.sort((a: any, b: any) => {
      if (a.addressType == args) {
        return 0;
      } else {
        return 1;
      }
    });
    return array;
  }
}
