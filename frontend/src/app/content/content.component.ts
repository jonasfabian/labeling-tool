import {Component, OnInit} from '@angular/core';
import {AudioSnippet} from '../models/audioSnippet';
import {TextAudioMatch} from '../models/textAudioMatch';
import {TextSnippet} from '../models/textSnippet';
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
    private apiService: ApiService
  ) {
  }

  file: any;
  audio: string;
  snip = new AudioSnippet(null, null);
  text: string | ArrayBuffer = '';

  fileTextWords: Array<string> = [];

  highlightedText = '';
  highlightedTextStartPos = 0;
  highlightedTextEndPos = 0;
  textAudioMatch = new TextAudioMatch(new AudioSnippet(0, 0), new TextSnippet(0, 0));

  selectTabIndex = 0;

  textAudioIndexArray: Array<TextAudioIndex> = [];

  ngOnInit() {
    this.readBlobAsText(3);
  }

  readBlobAsText(id: number): void {
    this.apiService.getTranscript(id).subscribe(tr => {
      const fileReader = new FileReader();
      const byteArray = new Uint8Array(tr[0].file);
      const blob = new Blob([byteArray], {type: 'application/octet-stream'});
      fileReader.addEventListener('loadend', (e) => {
        // @ts-ignore
        this.text = e.target.result;
      });
      fileReader.readAsText(blob);
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

  onFileChanged(file: File) {
    this.audio = URL.createObjectURL(file);
  }

  submitText(): void {
    this.textAudioMatch.audioSnippet = this.snip;
    this.textAudioMatch.textSnippet = new TextSnippet(this.highlightedTextStartPos, this.highlightedTextEndPos);
    this.selectTabIndex = 1;
    this.apiService.updateTextAudioIndex(new TextAudioIndex(13, 0, 0, 0, 0, 0, 0, 1)).subscribe(_ => {
      this.apiService.getTextAudioIndex().subscribe(t => this.textAudioIndexArray = t);
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
