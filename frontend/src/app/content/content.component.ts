import {Component, OnInit} from '@angular/core';
import {AudioSnippet} from '../models/audioSnippet';
import {MatSnackBar} from '@angular/material';
import {ApiService} from '../services/api.service';
import {DomSanitizer} from '@angular/platform-browser';
import {TextAudioIndex} from '../models/textAudioIndex';

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

  snip = new AudioSnippet(null, null);
  regionSnippet = new AudioSnippet(null, null);
  text: string | ArrayBuffer = '';
  selectTabIndex = 0;
  highlightedText = '';
  highlightedTextStartPos = 0;
  highlightedTextEndPos = 0;
  yeetTextAudioIndex = new TextAudioIndex(0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0);

  ngOnInit() {
    this.nextTranscript();
  }

  getRegionSnippet(snippet: AudioSnippet) {
    this.yeetTextAudioIndex.audioStartPos = snippet.startTime * this.yeetTextAudioIndex.samplingRate;
    this.yeetTextAudioIndex.audioEndPos = snippet.endTime * this.yeetTextAudioIndex.samplingRate;
  }

  nextTranscript() {
    this.apiService.getNonLabeledTextAudioIndex().subscribe(n => {
      this.yeetTextAudioIndex = n;
      this.snip = new AudioSnippet(n.audioStartPos / n.samplingRate, n.audioEndPos / n.samplingRate);
      this.apiService.getTranscript(n.transcriptFileId).subscribe(r => {
        this.text = r.text;
      });
    });
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

  submitText(): void {
    this.apiService.updateTextAudioIndex(new TextAudioIndex(this.yeetTextAudioIndex.id, this.yeetTextAudioIndex.samplingRate, this.yeetTextAudioIndex.textStartPos, this.yeetTextAudioIndex.textEndPos, this.yeetTextAudioIndex.audioStartPos, this.yeetTextAudioIndex.audioEndPos, this.yeetTextAudioIndex.speakerKey, 1, this.yeetTextAudioIndex.transcriptFileId)).subscribe();
    this.nextTranscript();
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
