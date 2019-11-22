import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-transcript-preview',
  templateUrl: './transcript-preview.component.html',
  styleUrls: ['./transcript-preview.component.scss']
})
export class TranscriptPreviewComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
}
