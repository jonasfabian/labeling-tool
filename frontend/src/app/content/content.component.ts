import {Component, OnInit} from '@angular/core';
import {Snippet} from '../models/snippet';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  constructor() {
  }

  file: any;
  audio: string;
  text: string | ArrayBuffer = '';
  highlightedText = '';
  snip = new Snippet(-1, -1);

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
  }

  retrieveSnippet(snippet: Snippet) {
    this.snip = snippet;
  }

  onFileChanged(file: File) {
    this.audio = URL.createObjectURL(file);
  }
}
