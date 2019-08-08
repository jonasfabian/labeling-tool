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
  selectedText = '';
  textEnd = '';
  loading = false;
  edit = false;

  yeet = false;

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
      this.yeet = true;
      this.selectedText = window.getSelection().toString();
      highlightedTextLength = this.highlightedText.length;
    }
    const tempStartPos = this.text.toString().indexOf(this.selectedText.toString());
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
    this.apiService.getNonLabeledTextAudioIndex(0).subscribe(nonLabeledTextAudioI => {
      this.dummyTextAudioIndex = nonLabeledTextAudioI;
      this.snip = new AudioSnippet(nonLabeledTextAudioI.audioStartPos / nonLabeledTextAudioI.samplingRate, nonLabeledTextAudioI.audioEndPos / nonLabeledTextAudioI.samplingRate);
      this.text = nonLabeledTextAudioI.text;
      this.textBegin = nonLabeledTextAudioI.text.slice(nonLabeledTextAudioI.textStartPos - 100, nonLabeledTextAudioI.textStartPos);
      this.selectedText = this.highlightedText = nonLabeledTextAudioI.text.slice(nonLabeledTextAudioI.textStartPos, nonLabeledTextAudioI.textEndPos);
      this.textEnd = nonLabeledTextAudioI.text.slice(nonLabeledTextAudioI.textEndPos, nonLabeledTextAudioI.textEndPos + 100);
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

  submitChangeText(): void {
    this.yeet = false;
    this.highlightedText = this.selectedText;
    this.edit = false;
  }

  reset(): void {
    this.yeet = false;
    this.selectedText = this.highlightedText;
  }
}
