import {Component, OnInit} from '@angular/core';
import {AudioSnippet} from '../../models/audioSnippet';
import {MatSnackBar} from '@angular/material';
import {ApiService} from '../../services/api.service';
import {DomSanitizer} from '@angular/platform-browser';
import {TextAudioIndexWithText} from '../../models/textAudioIndexWithText';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  constructor(
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    private apiService: ApiService
  ) {
  }

  snip = new AudioSnippet(null, null);
  text: string | ArrayBuffer = '';
  highlightedTextStartPos = 0;
  highlightedTextEndPos = 0;
  dummyTextAudioIndex = new TextAudioIndexWithText(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '');

  textBegin = '';
  highlightedText = '';
  textEnd = '';

  ngOnInit() {
    this.nextTranscript();
  }

  getRegionSnippet(snippet: AudioSnippet) {
    this.dummyTextAudioIndex.audioStartPos = snippet.startTime * this.dummyTextAudioIndex.samplingRate;
    this.dummyTextAudioIndex.audioEndPos = snippet.endTime * this.dummyTextAudioIndex.samplingRate;
  }

  nextTranscript() {
    this.apiService.getNonLabeledTextAudioIndex(0).subscribe(n => {
      this.dummyTextAudioIndex = n;
      this.snip = new AudioSnippet(n.audioStartPos / n.samplingRate, n.audioEndPos / n.samplingRate);
      this.text = n.text;
      this.textBegin = n.text.slice(0, n.textStartPos);
      this.highlightedText = n.text.slice(n.textStartPos, n.textEndPos);
      this.textEnd = n.text.slice(n.textEndPos, this.text.length - 1);
      this.dummyTextAudioIndex.labeled = 1;
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

  submitText(labeled: number): void {
    this.apiService.updateTextAudioIndex(this.dummyTextAudioIndex).subscribe(_ => {
      this.apiService.getNonLabeledTextAudioIndex(0).subscribe(n => {
        this.dummyTextAudioIndex = n;
        this.snip = new AudioSnippet(n.audioStartPos / n.samplingRate, n.audioEndPos / n.samplingRate);
        this.text = n.text;
        this.textBegin = n.text.slice(0, n.textStartPos);
        this.highlightedText = n.text.slice(n.textStartPos, n.textEndPos);
        this.textEnd = n.text.slice(n.textEndPos, this.text.length - 1);
        this.dummyTextAudioIndex.labeled = labeled;
      });
    });
  }
}
