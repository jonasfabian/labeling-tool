import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CarouselComponent} from 'ngx-carousel-lib';
import {ApiService} from '../../../services/api.service';
import {CheckIndex} from '../../../models/CheckIndex';
import {MatDialog} from '@angular/material';
import {ShortcutComponent} from '../../Multi-Use/shortcut/shortcut.component';
import {UserAndTextAudio} from '../../../models/UserAndTextAudio';
import {AuthService} from '../../../services/auth.service';
import {CheckMoreComponent} from '../check-more/check-more.component';
import {SessionOverviewComponent} from '../session-overview/session-overview.component';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';

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
  audiofileid = 0;
  BASE64_MARKER = ';base64,';
  blobUrl = '';
  snippet: any;
  isReady = false;
  waveSurfer: WaveSurfer = null;

  ngOnInit() {
    let fileid = 0;
    this.apiService.getTenNonLabeledTextAudiosByUser(this.authService.loggedInUser.id).subscribe(r => {
      fileid = r[0].fileid;
    }, () => {
    }, () => {
      this.initCarousel();
      this.initSessionCheckData();
      if (!this.waveSurfer) {
        this.generateWaveform(fileid);
      }
    });
  }

  generateWaveform(fileid: number): void {
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
      this.loadAudioBlob(fileid);
      this.waveSurfer.on('ready', () => {
        this.isReady = true;
      });
    });
  }

  loadAudioBlob(fileid: number): void {
    this.apiService.getAudioFile(fileid).subscribe(resp => {
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
    if (this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio.fileid !== this.audiofileid) {
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
    this.loadAudioBlob(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio.fileid);
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
      this.apiService.createUserAndTextAudio(new UserAndTextAudio(-1, this.authService.loggedInUser.id, currentCheckIndex.id)).subscribe(() => {
      }, () => {
      }, () => {
        if (this.audiofileid !== currentCheckIndex.fileid) {
          this.loadNextAudioFile();
        }
        this.audiofileid = currentCheckIndex.fileid;
        this.addRegion(
          this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio.audiostart,
          this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio.audioend
        );
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
      this.apiService.getTenNonLabeledTextAudiosByUser(this.authService.loggedInUser.id).subscribe(r => r.forEach(labeledTextAudio => {
        this.checkIndexArray.push(new CheckIndex(this.carouselIndex, labeledTextAudio, 0));
        this.carouselIndex++;
      }), () => {
      }, () => {
        this.apiService.loadAudioBlob(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio);
      });
    }
  }

  initCarousel(): void {
    this.apiService.getTenNonLabeledTextAudiosByUser(this.authService.loggedInUser.id).subscribe(r => r.forEach(l => {
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
        this.audiofileid = this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio.fileid;
        this.apiService.loadAudioBlob(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio);
        this.addRegion(
          this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio.audiostart,
          this.checkIndexArray[this.carousel.carousel.activeIndex].textAudio.audioend
        );
      }
    });
  }

  playRegion(): void {
    this.waveSurfer.on('audioprocess', () => {
      if (this.waveSurfer.getCurrentTime() < this.snippet.end) {
        this.isPlaying = true;
      } else {
        this.isPlaying = false;
      }
    });
    this.isPlaying = false;
    this.snippet.playLoop();
    this.resetAudioProgress();
    this.calculateAudioPlayerStatus();
  }

  addRegion(startPos: number, endPos: number): void {
    this.waveSurfer.clearRegions();
    this.snippet = this.waveSurfer.addRegion({
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
