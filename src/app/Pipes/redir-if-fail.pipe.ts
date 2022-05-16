import { Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';

@Pipe({
  name: 'redirIfFail',
})
export class RedirIfFailPipe implements PipeTransform {
  transform(route: string, array: any, router: Router): any {
    if (array.length > 0) {
      return true;
    } else {
      router.navigate([route]);
    }
  }
}
