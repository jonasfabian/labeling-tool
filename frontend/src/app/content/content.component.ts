import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  constructor() {
  }

  file: any;
  text: string | ArrayBuffer = '';
  highlightedText = '';

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
}
