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
  dummyTextAudio = new TextAudio(0, 0, 0, '', 0, '', 0, 0, 0);
  loading = false;

  ngOnInit() {
    this.textSetup();
  }

  getLoading(bool: boolean): void {
    this.loading = bool;
    this.ref.detectChanges();
  }

  getRegionSnippet(snippet: AudioSnippet) {
    this.dummyTextAudio.audioStart = snippet.startTime;
    this.dummyTextAudio.audioEnd = snippet.endTime;
  }

  submitText(): void {
    this.dummyTextAudio.labeled = 1;
    this.apiService.updateTextAudio(this.dummyTextAudio).subscribe(_ => {
      this.textSetup();
    });
  }

  textSetup(): void {
    this.apiService.getTextAudio().subscribe(textAudio => {
      this.dummyTextAudio = textAudio;
      this.snip = new AudioSnippet(textAudio.audioStart, textAudio.audioEnd);
      this.text = textAudio.text;
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
