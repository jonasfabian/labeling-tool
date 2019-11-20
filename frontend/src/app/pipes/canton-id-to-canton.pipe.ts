import {Pipe, PipeTransform} from '@angular/core';
import {ApiService} from '../services/api.service';

@Pipe({name: 'CantonIdToCanton'})
export class CantonIdToCantonPipe implements PipeTransform {

  constructor(
    private apiService: ApiService
  ) {
  }

  transform(cantonId: string): string {
    for (const canton of this.apiService.cantons) {
      if (cantonId === canton.cantonId) {
        return canton.cantonName;
      }
    }
  }
}
