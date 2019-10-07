import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-transcript-preview',
  templateUrl: './transcript-preview.component.html',
  styleUrls: ['./transcript-preview.component.scss']
})
export class TranscriptPreviewComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TranscriptPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
  }

  closePreview(): void {
    this.dialogRef.close();
  }
}
