import {Component} from '@angular/core';
import {OccurrenceMode} from './check/check.component';

@Component({
  selector: 'app-check-recording',
  template: '<app-check [checkMode]="mode"></app-check>',
})
export class CheckTextAudioComponent {
  mode = OccurrenceMode.TEXT_AUDIO;
}
