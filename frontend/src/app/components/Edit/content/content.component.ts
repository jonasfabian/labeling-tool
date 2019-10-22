import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AudioSnippet} from '../../../models/AudioSnippet';
import {ApiService} from '../../../services/api.service';
import {DomSanitizer} from '@angular/platform-browser';
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
    private ref: ChangeDetectorRef
  ) {
  }

  @ViewChild('hT', {static: true}) hT: ElementRef;
  snip = new AudioSnippet(null, null);
  text: string | ArrayBuffer = '';
  textAudio = new TextAudio(0, 0, 0, '', 0, '', 0, 0, 0);
  loading = false;

  ngOnInit() {
    this.textSetup();
  }

  getLoading(bool: boolean): void {
    this.loading = bool;
    this.ref.detectChanges();
  }

  getRegionSnippet(snippet: AudioSnippet) {
    this.textAudio.audiostart = snippet.startTime;
    this.textAudio.audioend = snippet.endTime;
  }

  submitText(): void {
    this.apiService.updateTextAudio(this.textAudio).subscribe(_ => {
      this.textSetup();
    });
  }

  textSetup(): void {
    this.apiService.getNonLabeledTextAudioIndex(1).subscribe(nonLabeledTextAudio => {
      this.textAudio = nonLabeledTextAudio;
      this.snip = new AudioSnippet(nonLabeledTextAudio.audiostart, nonLabeledTextAudio.audioend);
      this.text = nonLabeledTextAudio.text;
      this.textAudio.labeled = 1;
    });
  }
}
