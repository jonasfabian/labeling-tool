import {Component, OnInit} from '@angular/core';
import {AudioSnippet} from '../models/audioSnippet';
import {TextAudioMatch} from '../models/textAudioMatch';
import {TextSnippet} from '../models/textSnippet';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  constructor(
    private snackBar: MatSnackBar
  ) {
  }

  file: any;
  audio: string;
  snip = new AudioSnippet(0, -1, -1);
  text: string | ArrayBuffer = '';
  highlightedText = '';
  highlightedTextChars: Array<string> = [];
  highlightedTextStartPos = 0;
  highlightedTextEndPos = 0;
  textAudioMatch = new TextAudioMatch(new AudioSnippet(0, 0, 0), new TextSnippet(0, 0, 0, 0));

  ngOnInit() {
  }

  fileChanged(e) {
    const reader = new FileReader();
    this.file = e.target.files[0];
    reader.onload = () => {
      this.text = reader.result;
    };
    reader.readAsText(this.file);
  }

  displayHighlightedText() {
    let text = '';
    if (window.getSelection) {
      text = window.getSelection().toString();
    }
    this.highlightedText = text;
    this.highlightedTextChars = Array.from(this.highlightedText);
  }

  retrieveSnippet(snippet: AudioSnippet) {
    this.snip = snippet;
  }

  onFileChanged(file: File) {
    this.audio = URL.createObjectURL(file);
  }

  submitText(): void {
    this.textAudioMatch.audioSnippet = this.snip;
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
export class SnackBarComponent {}
