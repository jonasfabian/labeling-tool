import {Component, OnInit} from '@angular/core';
import {AudioSnippet} from '../models/audioSnippet';
import {TextAudioMatch} from '../models/textAudioMatch';
import {TextSnippet} from '../models/textSnippet';
import {MatSnackBar} from '@angular/material';
import {ApiService} from "../services/api.service";
import {Match} from "../models/match";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  constructor(
    private snackBar: MatSnackBar,
    private apiService: ApiService
  ) {
  }

  file: any;
  audio: string;
  snip = new AudioSnippet(-1, -1);
  text: string | ArrayBuffer = '';

  fileTextWords: Array<string> = [];

  highlightedText = '';
  highlightedTextStartPos = 0;
  highlightedTextEndPos = 0;
  textAudioMatch = new TextAudioMatch(new AudioSnippet(0, 0), new TextSnippet(0, 0));

  selectTabIndex = 0;

  ngOnInit() {
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
    this.apiService.createMatch(new Match(0, this.snip.startTime, this.snip.endTime, this.highlightedTextStartPos, this.highlightedTextEndPos)).subscribe(_ => {
      this.apiService.getMatches();
    });
    // TODO sent post request to future API
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
