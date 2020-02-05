import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CarouselComponent} from 'ngx-carousel-lib';
import {ApiService} from '../../../services/api.service';
import {CheckIndex} from '../../../models/check-index';
import {MatDialog} from '@angular/material';
import {ShortcutComponent} from '../shortcut/shortcut.component';
import {AuthService} from '../../../services/auth.service';
import {CheckMoreComponent} from '../check-more/check-more.component';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import {UserAndTextAudio} from '../../../models/user-and-text-audio';
import {AudioSnippet} from '../../../models/audio-snippet';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss']
})
export class CheckComponent implements OnInit {

  @ViewChild('carousel', {static: false}) carousel: CarouselComponent;
  @ViewChild('audioPlayer', {static: false}) audioPlayer: ElementRef;
  checkIndexArray: Array<CheckIndex> = [];
  available = false;
  isPlaying = false;
  carouselIndex = 0;
  skip = 3;
  correct = 1;
  wrong = 2;
  numberCorrect = 0;
  numberWrong = 0;
  numberSkipped = 0;
  progress = 0;
  panelOpenState = false;
  audioFileId = 0;
  snippet: any;
  isReady = false;
  waveSurfer: WaveSurfer = null;
  testVar = [];
  noDataYet = true;
  private userId: number;

  constructor(
    public apiService: ApiService,
    private dialog: MatDialog,
    private authService: AuthService,
    private detector: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => this.userId = user.principal.id);
    let fileId = 0;
    this.apiService.getTenNonLabeledTextAudios().subscribe(r => {
      this.testVar = r;
      if (r.length !== 0) {
        fileId = r[0].fileId;
        this.noDataYet = false;
      }
    }, () => {
    }, () => {
      if (this.testVar.length !== 0) {
        this.initCarousel();
        this.initSessionCheckData();
        if (!this.waveSurfer) {
          this.generateWaveform(fileId);
        }
      } else {
        this.noDataYet = true;
      }
    });
  }

  generateWaveform(fileId: number): void {
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
      this.loadAudioBlob(fileId);
      this.waveSurfer.on('ready', () => {
        this.isReady = true;
      });
      this.waveSurfer.on('finish', () => {
        this.isPlaying = false;
        this.detector.detectChanges();
      });
    });
  }

  loadAudioBlob(fileId: number): void {
    this.apiService.getAudioFile(fileId).subscribe(resp => {
      this.waveSurfer.load(URL.createObjectURL(resp));
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
    this.addNumberOfCheckType(checkType);
    this.prepareNextSlide(checkType);
    this.carousel.slideNext();
    if (this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio.fileId !== this.audioFileId) {
      this.loadNextAudioFile();
    }
  }

  addNumberOfCheckType(checkType: number): void {
    if (checkType === this.correct) {
      this.numberCorrect++;
    } else if (checkType === this.wrong) {
      this.numberWrong++;
    } else {
      this.numberSkipped++;
    }
  }

  loadNextAudioFile(): void {
    this.loadAudioBlob(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio.fileId);
  }

  initSessionCheckData(): void {
    if (!sessionStorage.getItem('checkData')) {
      sessionStorage.setItem('checkData', JSON.stringify([{correct: 0, wrong: 0, skipped: 0}]));
    }
    this.numberCorrect = JSON.parse(sessionStorage.getItem('checkData'))[0].correct;
    this.numberWrong = JSON.parse(sessionStorage.getItem('checkData'))[0].wrong;
    this.numberSkipped = JSON.parse(sessionStorage.getItem('checkData'))[0].skipped;
  }

  updateSessionCheckData(): void {
    sessionStorage.setItem('checkData', JSON.stringify([{
      correct: this.numberCorrect,
      wrong: this.numberWrong,
      skipped: this.numberSkipped
    }]));
  }

  resetAudioProgress(): void {
    this.progress = 0;
  }

  calculateAudioPlayerStatus(): void {
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

  prepareNextSlide(labeledType: number): void {
    this.isPlaying = false;
    this.waveSurfer.stop();
    this.resetAudioProgress();
    this.updateSessionCheckData();
    this.checkIfFinishedChunk();
    const currentCheckIndex = this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio;
    if (labeledType === this.correct) {
      currentCheckIndex.labeled = 1;
      currentCheckIndex.correct++;
    } else if (labeledType === this.wrong) {
      currentCheckIndex.labeled = 1;
      currentCheckIndex.wrong++;
    }
    this.apiService.updateTextAudio(currentCheckIndex).subscribe(_ => {
      this.apiService.createUserAndTextAudioIndex(
        new UserAndTextAudio(-1, this.userId, currentCheckIndex.id)
      ).subscribe(() => {
      }, () => {
      }, () => {
        if (this.audioFileId !== currentCheckIndex.fileId) {
          this.loadNextAudioFile();
        }
        this.audioFileId = currentCheckIndex.fileId;
      });
    });
  }

  checkIfFinishedChunk(): void {
    if (this.carousel.carousel.activeIndex === this.checkIndexArray.length - 1) {
      this.apiService.showTenMoreQuest = true;
      this.openCheckMoreDialog();
    }
  }

  lastSlide(): void {
    if (this.carousel.carousel.activeIndex === this.checkIndexArray.length) {
      this.apiService.getTenNonLabeledTextAudios().subscribe(r => r.forEach(labeledTextAudioIndex => {
        this.checkIndexArray.push(new CheckIndex(this.carouselIndex, labeledTextAudioIndex, 0));
        this.carouselIndex++;
      }), () => {
      }, () => {
        this.apiService.loadAudioBlob(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio);
      });
    }
  }

  initCarousel(): void {
    this.apiService.getTenNonLabeledTextAudios().subscribe(r => r.forEach(l => {
      if (r.length !== 0) {
        this.available = true;
        this.checkIndexArray.push(new CheckIndex(this.carouselIndex, l, 0));
        this.carouselIndex++;
      } else {
        this.available = false;
      }
    }), () => {
    }, () => {
      if (this.checkIndexArray.length !== 0) {
        this.progress = 0;
        this.audioFileId = this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio.fileId;
        this.apiService.loadAudioBlob(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio);
        this.addRegion(
          this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio.audioStart,
          this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio.audioEnd
        );
      }
    });
  }

  playRegion(): void {
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

  setColor(checkedType: number): string {
    if (checkedType === 1) {
      return 'green';
    } else if (checkedType === 2) {
      return 'red';
    } else {
      return 'lightgray';
    }
  }

  addRegion(startPos: number, endPos: number): void {
    this.waveSurfer.clearRegions();
    this.snippet = this.waveSurfer.addRegion({
      start: startPos,
      end: endPos,
      resize: false
    });
  }

  resetCarousel(): void {
    this.progress = 0;
    this.carouselIndex = 0;
    this.checkIndexArray = [];
    this.initCarousel();
    this.carousel.carousel.activeIndex = 0;
  }

  openShortcutDialog(): void {
    this.dialog.open(ShortcutComponent, {width: '500px', disableClose: false});
  }

  openCheckMoreDialog(): void {
    this.dialog.open(CheckMoreComponent, {width: '500px', disableClose: true}).afterClosed().subscribe(() => {
      this.resetCarousel();
    });
  }
}
