import {Component, HostListener, OnInit} from '@angular/core';
import {AudioSnippet} from '../../models/audioSnippet';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ApiService} from '../../services/api.service';
import {DomSanitizer} from '@angular/platform-browser';
import {TextAudioIndexWithText} from '../../models/textAudioIndexWithText';
import {ShortcutComponent} from '../shortcut/shortcut.component';

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
    public dialog: MatDialog
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

  loading = false;

  ngOnInit() {
    this.textSetup();
  }

  getLoading(bool: boolean): void {
    this.loading = bool;
  }

  getRegionSnippet(snippet: AudioSnippet) {
    this.dummyTextAudioIndex.audioStartPos = snippet.startTime * this.dummyTextAudioIndex.samplingRate;
    this.dummyTextAudioIndex.audioEndPos = snippet.endTime * this.dummyTextAudioIndex.samplingRate;
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
    this.apiService.updateTextAudioIndex(this.dummyTextAudioIndex).subscribe(_ => {
      this.textSetup();
    });
  }

  textSetup(): void {
    this.apiService.getNonLabeledTextAudioIndex(0).subscribe(n => {
      this.dummyTextAudioIndex = n;
      this.snip = new AudioSnippet(n.audioStartPos / n.samplingRate, n.audioEndPos / n.samplingRate);
      this.text = n.text;
      this.textBegin = n.text.slice(n.textStartPos - 100, n.textStartPos);
      this.highlightedText = n.text.slice(n.textStartPos, n.textEndPos);
      this.textEnd = n.text.slice(n.textEndPos, n.textEndPos + 100);
      this.dummyTextAudioIndex.labeled = 1;
    });
  }

  openShortcutDialog(): void {
    this.dialog.open(ShortcutComponent, {width: '500px'});
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'c') {
      this.submitText();
    } else if (event.key === 's') {
      this.submitText();
    }
  }
}
