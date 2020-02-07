import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CarouselComponent} from 'ngx-carousel-lib';
import {ApiService} from '../../../services/api.service';
import {CheckIndex} from '../../../models/check-index';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../../services/auth.service';
import {CheckMoreComponent} from '../check-more/check-more.component';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import {UserAndTextAudio} from '../../../models/user-and-text-audio';
import {AudioSnippet} from '../../../models/audio-snippet';
import {ShortcutComponent} from '../shortcut/shortcut.component';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss']
})
export class CheckComponent implements OnInit {
// TODO why do we use both audioplayer and waveform?
  @ViewChild('carousel') carousel: CarouselComponent;
  @ViewChild('audioPlayer') audioPlayer: ElementRef;
  checkIndexArray: Array<CheckIndex> = [];
  available = false;
  isPlaying = false;
  skip = 3;
  correct = 1;
  wrong = 2;
  progress = 0;
  isReady = false;
  noDataYet = true;
  private carouselIndex = 0;
  private audioFileId = 0;
  private snippet: any;
  private waveSurfer: WaveSurfer = null;
  private userId: number;

  constructor(public apiService: ApiService, private dialog: MatDialog, private authService: AuthService, private detector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => this.userId = user.principal.id);
    this.apiService.getTenNonLabeledTextAudios().subscribe(r => {
      if (r.length > 0) {
        this.noDataYet = false;
        this.initCarousel();
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
            this.loadAudioBlob(r[0].fileid);
            this.waveSurfer.on('ready', () => {
              this.isReady = true;
            });
            this.waveSurfer.on('finish', () => {
              this.isPlaying = false;
              this.detector.detectChanges();
            });
          });
        }
      } else {
        this.noDataYet = true;
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

  setCheckedType(checkType: number): void {
    this.checkIndexArray[this.carousel.carousel.activeIndex].checkedType = checkType;
    this.prepareNextSlide(checkType);
    this.carousel.slideNext();
    if (this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio.fileid !== this.audioFileId) {
      this.loadNextAudioFile();
    }
  }

  prepareNextSlide(labeledType: number): void {
    this.isPlaying = false;
    this.waveSurfer.stop();
    this.resetAudioProgress();
    // checkIfFinishedChunk
    if (this.carousel.carousel.activeIndex === this.checkIndexArray.length - 1) {
      this.apiService.showTenMoreQuest = true;
      // TODO not sure this component makes sense as we ignore the respone anyway and instead go over the service.
      this.dialog.open(CheckMoreComponent, {width: '500px', disableClose: true}).afterClosed().subscribe(() => {
        // reset carousel
        this.progress = 0;
        this.carouselIndex = 0;
        this.checkIndexArray = [];
        this.initCarousel();
        this.carousel.carousel.activeIndex = 0;
      });
    }
    const currentCheckIndex = this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio;
    currentCheckIndex.labeled = true;
    if (labeledType === this.correct) {
      currentCheckIndex.correct++;
    } else if (labeledType === this.wrong) {
      currentCheckIndex.wrong++;
    }
    this.apiService.updateTextAudio(currentCheckIndex).subscribe(() => {
      this.apiService.createUserAndTextAudioIndex(new UserAndTextAudio(-1, this.userId, currentCheckIndex.id)).subscribe(() => {
        if (this.audioFileId !== currentCheckIndex.fileid) {
          this.loadNextAudioFile();
        }
        this.audioFileId = currentCheckIndex.fileid;
      });
    });
  }

  onSlideChange() {
    if (this.carousel.carousel.activeIndex === this.checkIndexArray.length) {
      this.apiService.getTenNonLabeledTextAudios().subscribe(r => {
        r.forEach(labeledTextAudioIndex => {
          this.checkIndexArray.push(new CheckIndex(this.carouselIndex, labeledTextAudioIndex, 0));
          this.carouselIndex++;
        });
        this.apiService.loadAudioBlob(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio);
      });
    }
  }

  playRegion() {
    this.waveSurfer.clearRegions();
    const region = new AudioSnippet(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio.audioStart,
      this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio.audioEnd);
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

  getColor = (checkedType: number): string => checkedType === 1 ? 'green' : checkedType === 2 ? 'red' : 'lightgray';
  openShortcutDialog = () => this.dialog.open(ShortcutComponent, {width: '500px', disableClose: false});
  private loadNextAudioFile = () => this.loadAudioBlob(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio.fileid);
  private resetAudioProgress = () => this.progress = 0;

  private loadAudioBlob(fileId: number): void {
    this.apiService.getAudioFile(fileId).subscribe(resp => {
      this.waveSurfer.load(URL.createObjectURL(resp));
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

  private initCarousel() {
    this.apiService.getTenNonLabeledTextAudios().subscribe(r => {
      r.forEach(l => {
        if (r.length !== 0) {
          this.available = true;
          this.checkIndexArray.push(new CheckIndex(this.carouselIndex, l, 0));
          this.carouselIndex++;
        } else {
          this.available = false;
        }
      });
      if (this.checkIndexArray.length !== 0) {
        this.progress = 0;
        this.audioFileId = this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio.fileid;
        this.apiService.loadAudioBlob(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio);
        this.addRegion(
          this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio.audioStart,
          this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio.audioEnd
        );
      }
    });
  }
}
