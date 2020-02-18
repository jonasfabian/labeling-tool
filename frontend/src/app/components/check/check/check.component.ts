import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CarouselComponent} from 'ngx-carousel-lib';
import {ApiService} from '../../../services/api.service';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../../services/auth.service';
import {CheckMoreComponent} from '../check-more/check-more.component';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import {AudioSnippet} from '../../../models/audio-snippet';
import {ShortcutComponent} from '../shortcut/shortcut.component';
import {HttpClient} from '@angular/common/http';
import {TextAudio} from '../../../models/text-audio';
import {environment} from '../../../../environments/environment';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss']
})
export class CheckComponent implements OnInit {

//  TODO simplifiy whole component

// TODO why do we use both audioplayer and waveform?
  @ViewChild('carousel') carousel: CarouselComponent;
  @ViewChild('audioPlayer') audioPlayer: ElementRef;
  isPlaying = false;
  skip = 3;
  correct = 1;
  wrong = 2;
  progress = 0;
  isReady = false;
  textAudios: Array<TextAudio> = [];
  blobUrl: SafeUrl = '';
  private carouselIndex = 0;
  private snippet: any;
  private waveSurfer: WaveSurfer = null;
  private userId: number;
  // TODO replace dummy id with real one
  private groupId = 1;

  constructor(private apiService: ApiService, private httpClient: HttpClient, private dialog: MatDialog, private authService: AuthService,
              private detector: ChangeDetectorRef, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => this.userId = user.principal.id);
    // TODO load audio only once
    this.getTenNonLabeledTextAudios().subscribe(textAudios => {
      this.textAudios = textAudios;
      if (textAudios.length > 0) {
        if (!this.waveSurfer) {
          // generateWaveform
          Promise.resolve(null).then(() => {
            this.waveSurfer = WaveSurfer.create({
              container: '#waveform',
              backend: 'MediaElement',
              partialRender: false,
              normalize: false,
              responsive: true,
              plugins: [
                RegionsPlugin.create({
                  regions: []
                })
              ]
            });
            this.loadAudioBlob(textAudios[0].fileid);
            this.waveSurfer.on('ready', () => {
              this.isReady = true;
            });
            this.waveSurfer.on('finish', () => {
              this.isPlaying = false;
              this.detector.detectChanges();
            });
          });
        }
      }
    });
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'p') {
      this.playRegion();
    } else if (event.key === 'c') {
      this.setCheckedType(1);
    } else if (event.key === 'w') {
      this.setCheckedType(2);
    } else if (event.key === 's') {
      this.setCheckedType(3);
    }
  }

  /**
   * set the checked type and prepare the next carousel
   */
  setCheckedType(checkType: number): void {
    // TODO replace checkType nuber with enum
    // TODO move to prepare and only load the required audio blob

    // TODO only trigger this method if the user has played the audio at least once to prevent accidental button presses

    this.isPlaying = false;
    this.waveSurfer.stop();
    this.resetAudioProgress();

    const textAudio = this.textAudios[this.carousel.carousel.activeIndex];
    // TODO correcly save that the label
    // this.httpClient.post(`${environment.url}user_group/${this.groupId}/text_audio/next`, {textAudioId: textAudio.id});

    // checkIfFinishedChunk
    if (this.carousel.carousel.activeIndex === this.textAudios.length - 1) {
      this.apiService.showTenMoreQuest = true;
      // TODO not sure this component makes sense as we ignore the respone anyway and instead go over the service.
      this.dialog.open(CheckMoreComponent, {width: '500px', disableClose: true}).afterClosed().subscribe(() => {
        // reset carousel
        this.progress = 0;
        this.carouselIndex = 0;
        this.textAudios = [];
        // TODO load new  ones -> this is ignored anyway as we force a reload
        this.carousel.carousel.activeIndex = 0;
      });
    } else {
      this.loadNextAudioFile();
      this.carousel.slideNext();
    }
  }

  // TODO replace with html audio
  playRegion() {
    this.waveSurfer.clearRegions();
    const region = new AudioSnippet(this.textAudios[this.carousel.carousel.activeIndex].audioStart,
      this.textAudios[this.carousel.carousel.activeIndex].audioEnd);
    this.addRegion(region.startTime, region.endTime);
    this.waveSurfer.on('audioprocess', () => {
      if (this.waveSurfer.getCurrentTime() === region.endTime) {
        this.isPlaying = false;
      }
    });
    if (this.isPlaying) {
      this.resetAudioProgress();
      this.calculateAudioPlayerStatus();
      this.isPlaying = false;
      this.waveSurfer.pause();
    } else {
      this.waveSurfer.stop();
      this.resetAudioProgress();
      this.calculateAudioPlayerStatus();
      this.isPlaying = true;
      this.snippet.play();
    }
  }

  openShortcutDialog = () => this.dialog.open(ShortcutComponent, {width: '500px', disableClose: false});
  private loadNextAudioFile = () => this.loadAudioBlob(this.textAudios[this.carousel.carousel.activeIndex].fileid);
  private resetAudioProgress = () => this.progress = 0;

  // TODO do we really need to poll them 3 times? -> simplify logic
  private getTenNonLabeledTextAudios() {
    return this.httpClient.get<Array<TextAudio>>(`${environment.url}user_group/${this.groupId}/text_audio/next`);
  }

  private loadAudioBlob(fileId: number): void {
    // TODO maybe just use html5 audio? -> loading symbol does not make any sense anymore as we do not wait for the loaded audio.
    this.apiService.getAudioFile(fileId).subscribe(resp => {
      this.waveSurfer.load(URL.createObjectURL(resp));
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(resp));
    });
  }

  private calculateAudioPlayerStatus(): void {
    const start = this.snippet.start;
    const end = this.snippet.end;
    const length = end - start;
    this.waveSurfer.on('audioprocess', () => {
      const diff = end - this.waveSurfer.getCurrentTime();
      if (diff > 0) {
        this.progress = 100 - Math.round(diff / length * 100);
      }
    });
  }

  private addRegion(startPos: number, endPos: number) {
    this.waveSurfer.clearRegions();
    this.snippet = this.waveSurfer.addRegion({
      start: startPos,
      end: endPos,
      resize: false
    });
  }
}
