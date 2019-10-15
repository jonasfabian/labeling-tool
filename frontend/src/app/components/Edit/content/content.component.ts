import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {AudioSnippet} from '../../../models/AudioSnippet';
import {MatDialog} from '@angular/material';
import {ApiService} from '../../../services/api.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ShortcutComponent} from '../../Multi-Use/shortcut/shortcut.component';
import {AuthService} from '../../../services/auth.service';
import {TextAudio} from '../../../models/TextAudio';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  constructor(
    private sanitizer: DomSanitizer,
    private apiService: ApiService,
    private authService: AuthService,
    public dialog: MatDialog,
    private ref: ChangeDetectorRef
  ) {
  }

  @ViewChild('hT', {static: true}) hT: ElementRef;
  snip = new AudioSnippet(null, null);
  text: string | ArrayBuffer = '';
  dummyTextAudioIndex = new TextAudio(0, 0, 0, '', 0, '', 0, 0, 0);
  textBegin = '';
  highlightedText = '';
  selectedText = '';
  textEnd = '';
  loading = false;

  ngOnInit() {
    this.textSetup();
  }

  getLoading(bool: boolean): void {
    this.loading = bool;
    this.ref.detectChanges();
  }

  getRegionSnippet(snippet: AudioSnippet) {
    this.dummyTextAudioIndex.audioStart = snippet.startTime;
    this.dummyTextAudioIndex.audioEnd = snippet.endTime;
  }

  displayHighlightedText() {
    let highlightedTextLength = 0;
    if (window.getSelection) {
      this.hT.nativeElement.style.backgroundColor = 'white';
      this.selectedText = window.getSelection().toString();
      highlightedTextLength = this.selectedText.length;
    }
    const tempStartPos = this.text.toString().indexOf(this.selectedText.toString());
    const tempEndPos = tempStartPos + highlightedTextLength;
    if (tempStartPos !== -1) {
      this.dummyTextAudioIndex.audioStart = tempStartPos;
      this.dummyTextAudioIndex.audioEnd = tempEndPos;
    }
  }

  submitText(): void {
    this.dummyTextAudioIndex.labeled = 1;
    this.apiService.updateTextAudio(this.dummyTextAudioIndex).subscribe(_ => {
      this.textSetup();
    });
  }

  textSetup(): void {
    this.apiService.getTextAudio().subscribe(textAudio => {
      this.dummyTextAudioIndex = textAudio;
      this.snip = new AudioSnippet(textAudio.audioStart, textAudio.audioEnd);
      this.text = textAudio.text;
    });
  }

  showMoreTextBefore(): void {
    const begin = this.text.toString().indexOf(this.textBegin);
    const end = this.text.toString().indexOf(this.textBegin) + this.textBegin.length;
    this.textBegin = this.text.slice(begin - 20, end).toString();
  }

  showMoreTextAfter(): void {
    const begin = this.text.toString().indexOf(this.textEnd);
    const end = this.text.toString().indexOf(this.textEnd) + this.textEnd.length;
    this.textEnd = this.text.slice(begin, end + 20).toString();
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
