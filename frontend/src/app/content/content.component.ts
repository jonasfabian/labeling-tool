import {Component, OnInit} from '@angular/core';
import {AudioSnippet} from '../models/audioSnippet';
import {MatSnackBar} from '@angular/material';
import {ApiService} from '../services/api.service';
import {TextAudioIndex} from '../models/textAudioIndex';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  constructor(
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
  ) {
  }

  file: any;
  snip = new AudioSnippet(null, null);
  text: string | ArrayBuffer = '';

  fileTextWords: Array<string> = [];

  highlightedText = '';
  highlightedTextStartPos = 0;
  highlightedTextEndPos = 0;

  selectTabIndex = 0;
  index = 0;

  textAudioIndexArray: Array<TextAudioIndex> = [];

  ngOnInit() {
    this.index++;
    this.nextTranscript();
  }

  nextTranscript() {
    this.apiService.getTranscript(this.index).subscribe(r => {
      this.text = r.text;
    });
  }

  fileChanged(e) {
    const reader = new FileReader();
    this.file = e.target.files[0];
    reader.onload = () => {
      this.text = reader.result;
      this.fileTextWords = this.text.toString().split(' ');
    };
    reader.readAsText(this.file);
  }

  displayHighlightedText() {
    let highlightedTextLength = 0;
    if (window.getSelection) {
      this.highlightedText = window.getSelection().toString();
      highlightedTextLength = this.highlightedText.length;
    }
    const tempStartPos = this.text.toString().indexOf(this.highlightedText.toString());
    const tempEndPos = tempStartPos + highlightedTextLength;
    if (tempStartPos !== -1) {
      this.highlightedTextStartPos = tempStartPos;
      this.highlightedTextEndPos = tempEndPos;
    }
  }

  retrieveSnippet(snippet: AudioSnippet) {
    this.snip = snippet;
  }

  submitText(): void {
    this.apiService.getTextAudioIndex(this.index).subscribe(tr => {
      this.apiService.updateTextAudioIndex(new TextAudioIndex(tr.id, tr.samplingRate, this.highlightedTextStartPos, this.highlightedTextEndPos, this.snip.startTime, this.snip.endTime, tr.speakerKey, 1, tr.transcriptFileId)).subscribe(_ => {
        this.index++;
        this.nextTranscript();
        this.apiService.getTextAudioIndexes().subscribe(i => {
          this.textAudioIndexArray = i;
        });
      });
    });
  }

  openSnackBar(uploadSuccess: boolean): void {
    if (uploadSuccess) {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 5000
      });
    }
  }
}


@Component({
  selector: 'app-content-snack-bar-component',
  templateUrl: 'app-content-snack-bar-component.html'
})
export class SnackBarComponent {
}
