import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'IntToBooleanPipe'})
export class IntToBooleanPipe implements PipeTransform {
  transform(int: number): boolean {
    return int !== 0;
  }
}
