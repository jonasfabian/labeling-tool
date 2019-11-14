import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CarouselComponent} from 'ngx-carousel-lib';
import {ApiService} from '../../../services/api.service';
import {CheckIndex} from '../../../models/CheckIndex';
import {MatDialog} from '@angular/material';
import {ShortcutComponent} from '../../Multi-Use/shortcut/shortcut.component';
import {AuthService} from '../../../services/auth.service';
import {CheckMoreComponent} from '../check-more/check-more.component';
import {SessionOverviewComponent} from '../session-overview/session-overview.component';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import {UserAndTextAudio} from '../../../models/UserAndTextAudio';
import {AudioSnippet} from '../../../models/AudioSnippet';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss']
})
export class CheckComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private authService: AuthService
  ) {
  }

  @ViewChild('carousel', {static: false}) carousel: CarouselComponent;
  @ViewChild('audioPlayer', {static: false}) audioPlayer: ElementRef;
  checkIndexArray: Array<CheckIndex> = [];
  available = false;
  isPlaying = false;
  carouselIndex = 0;
  correct = 1;
  wrong = 2;
  numberCorrect = 0;
  numberWrong = 0;
  progress = 0;
  panelOpenState = false;
  audioFileId = 0;
  snippet: any;
  isReady = false;
  waveSurfer: WaveSurfer = null;

  ngOnInit() {
    let fileId = 0;
    this.apiService.getTenNonLabeledTextAudios().subscribe(r => {
      fileId = r[0].fileId;
    }, () => {
    }, () => {
      this.initCarousel();
      this.initSessionCheckData();
      if (!this.waveSurfer) {
        this.generateWaveform(fileId);
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
    }
  }

  loadNextAudioFile(): void {
    this.loadAudioBlob(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio.fileId);
  }

  initSessionCheckData(): void {
    if (!sessionStorage.getItem('checkData')) {
      sessionStorage.setItem('checkData', JSON.stringify([{correct: 0, wrong: 0}]));
    }
    this.numberCorrect = JSON.parse(sessionStorage.getItem('checkData'))[0].correct;
    this.numberWrong = JSON.parse(sessionStorage.getItem('checkData'))[0].wrong;
  }

  updateSessionCheckData(): void {
    sessionStorage.setItem('checkData', JSON.stringify([{
      correct: this.numberCorrect,
      wrong: this.numberWrong
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
        new UserAndTextAudio(-1, this.authService.loggedInUser.getValue().id, currentCheckIndex.id)
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
    const region = new AudioSnippet(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio.audioStart, this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio.audioEnd);
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

  openSessionOverview(): void {
    this.dialog.open(SessionOverviewComponent, {width: '500px', disableClose: false});
  }

  openCheckMoreDialog(): void {
    this.dialog.open(CheckMoreComponent, {width: '500px', disableClose: true}).afterClosed().subscribe(() => {
      this.resetCarousel();
    });
  }
}
