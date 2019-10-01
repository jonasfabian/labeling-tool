import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CarouselComponent} from 'ngx-carousel-lib';
import {ApiService} from '../../../services/api.service';
import {CheckIndex} from '../../../models/CheckIndex';
import {MatDialog} from '@angular/material';
import {ShortcutComponent} from '../../Multi-Use/shortcut/shortcut.component';
import {UserAndTextAudioIndex} from '../../../models/UserAndTextAudioIndex';
import {AuthService} from '../../../services/auth.service';
import {CheckMoreComponent} from '../check-more/check-more.component';
import {SessionOverviewComponent} from '../session-overview/session-overview.component';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
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
  skip = 3;
  correct = 1;
  wrong = 2;
  numberCorrect = 0;
  numberWrong = 0;
  numberSkipped = 0;
  progress = 0;
  panelOpenState = false;
  audioFileId = 0;
  BASE64_MARKER = ';base64,';
  blobUrl = '';
  reg = new AudioSnippet(null, null);
  test: any;
  isReady = false;
  waveSurfer: WaveSurfer = null;

  ngOnInit() {
    let fileId = 0;
    this.apiService.getTenNonLabeledTextAudioIndex(this.authService.loggedInUser.id).subscribe(r => {
      fileId = r[0].transcriptFileId;
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
      const reader = new FileReader();
      reader.readAsDataURL(resp);
      reader.addEventListener('loadend', () => {
        const binary = this.convertDataURIToBinary(reader.result);
        const blob = new Blob([binary], {type: `application/octet-stream`});
        this.blobUrl = URL.createObjectURL(blob);
        this.waveSurfer.load(this.blobUrl);
      });
    });
  }

  convertDataURIToBinary(dataURI) {
    const base64Index = dataURI.indexOf(this.BASE64_MARKER) + this.BASE64_MARKER.length;
    const base64 = dataURI.substring(base64Index);
    const raw = window.atob(base64);
    const rawLength = raw.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
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
    if (this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.transcriptFileId !== this.audioFileId) {
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
    this.loadAudioBlob(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.transcriptFileId);
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

  setAudioPlayerStartTime(): void {
    this.audioPlayer.nativeElement.currentTime = Math.round(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.audioStartPos / this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.samplingRate);
  }

  setAudioPlayerEndTime(): void {
    this.audioPlayer.nativeElement.addEventListener('timeupdate', () => {
      if (this.audioPlayer.nativeElement.currentTime > this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.audioEndPos / this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.samplingRate) {
        this.audioPlayer.nativeElement.pause();
        this.isPlaying = false;
      }
    });
  }

  calculateAudioPlayerStatus(): void {
    this.resetAudioProgress();
    const startTime = this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.audioStartPos / this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.samplingRate;
    const endTime = this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.audioEndPos / this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.samplingRate;
    const totalTime = endTime - startTime;
    const timer = setInterval(() => {
      if (this.audioPlayer.nativeElement.currentTime <= endTime) {
        this.progress = 100 - Math.round((endTime - this.audioPlayer.nativeElement.currentTime) / totalTime * 100);
      } else {
        clearInterval(timer);
      }
    }, 16);
  }

  prepareNextSlide(labeledType: number): void {
    this.resetAudioProgress();
    this.updateSessionCheckData();
    this.checkIfFinishedChunk();
    const currentCheckIndex = this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText;
    if (labeledType === this.correct) {
      currentCheckIndex.labeled = 1;
      currentCheckIndex.correct++;
    } else if (labeledType === this.wrong) {
      currentCheckIndex.labeled = 1;
      currentCheckIndex.wrong++;
    }
    this.apiService.updateTextAudioIndex(currentCheckIndex).subscribe(_ => {
      this.apiService.createUserAndTextAudioIndex(new UserAndTextAudioIndex(-1, this.authService.loggedInUser.id, currentCheckIndex.id)).subscribe(() => {
      }, () => {
      }, () => {
        if (this.audioFileId !== currentCheckIndex.transcriptFileId) {
          this.loadNextAudioFile();
        }
        this.audioFileId = currentCheckIndex.transcriptFileId;
        this.addRegion(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.audioStartPos / this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.samplingRate, this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.audioEndPos / this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.samplingRate);
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
      this.apiService.getTenNonLabeledTextAudioIndex(this.authService.loggedInUser.id).subscribe(r => r.forEach(labeledTextAudioIndex => {
        labeledTextAudioIndex.text = labeledTextAudioIndex.text.slice(labeledTextAudioIndex.textStartPos, labeledTextAudioIndex.textEndPos);
        this.checkIndexArray.push(new CheckIndex(this.carouselIndex, labeledTextAudioIndex, 0));
        this.carouselIndex++;
      }), () => {
      }, () => {
        this.apiService.loadAudioBlob(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText);
      });
    }
  }

  initCarousel(): void {
    this.apiService.getTenNonLabeledTextAudioIndex(this.authService.loggedInUser.id).subscribe(r => r.forEach(l => {
      if (r.length !== 0) {
        this.available = true;
        l.text = l.text.slice(l.textStartPos, l.textEndPos);
        this.checkIndexArray.push(new CheckIndex(this.carouselIndex, l, 0));
        this.carouselIndex++;
      } else {
        this.available = false;
      }
    }), () => {
    }, () => {
      if (this.checkIndexArray.length !== 0) {
        this.progress = 0;
        this.audioFileId = this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.transcriptFileId;
        this.apiService.loadAudioBlob(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText);
        this.addRegion(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.audioStartPos / this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.samplingRate, this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.audioEndPos / this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.samplingRate);

      }
    });
  }

  playRegion(): void {
    this.waveSurfer.on('audioprocess', () => {
      if (this.waveSurfer.getCurrentTime() < this.test.end) {
        this.isPlaying = true;
      } else {
        this.isPlaying = false;
      }
    });
    this.isPlaying = false;
    this.test.playLoop();
    this.resetAudioProgress();
    this.calculateAudioPlayerStatus();
  }

  addRegion(startPos: number, endPos: number): void {
    this.waveSurfer.clearRegions();
    this.test = this.waveSurfer.addRegion({
      start: startPos,
      end: endPos,
      resize: true,
      color: 'hsla(200, 50%, 70%, 0.4)'
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
