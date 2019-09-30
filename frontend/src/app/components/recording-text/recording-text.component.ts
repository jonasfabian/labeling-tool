import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TranscriptPreviewComponent} from '../transcript-preview/transcript-preview.component';

@Component({
  selector: 'app-recording-text',
  templateUrl: './recording-text.component.html',
  styleUrls: ['./recording-text.component.scss']
})
export class RecordingTextComponent implements OnInit {

  constructor(
    public dialog: MatDialog
  ) {
  }

  fileContent: string | ArrayBuffer = '';

  ngOnInit() {
  }

  handleFileInput(fileList: FileList): void {
    const file = fileList[0];
    const fileReader: FileReader = new FileReader();
    fileReader.onloadend = () => {
      this.fileContent = fileReader.result;
    };
    fileReader.readAsText(file);
  }

  openTranscriptPreviewDialog(): void {
    this.dialog.open(TranscriptPreviewComponent, {
      width: 'calc(100% - 1px)',
      height: 'calc(100% - 200px)',
      disableClose: false,
      data: {
        transcript: this.fileContent
      }
    });
  }
}
