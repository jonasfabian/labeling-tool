import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CarouselComponent} from 'ngx-carousel-lib';
import {ApiService} from '../../services/api.service';
import {TextAudioIndexWithText} from '../../models/textAudioIndexWithText';
import {CheckIndex} from '../../models/checkIndex';
import {MatDialog} from '@angular/material';
import {ShortcutComponent} from '../shortcut/shortcut.component';
import {UserAndTextAudioIndex} from '../../models/UserAndTextAudioIndex';
import {AuthService} from '../../services/auth.service';
import {CheckMoreComponent} from '../check-more/check-more.component';
import {SessionOverviewComponent} from '../session-overview/session-overview.component';

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
  checkedTextAudioIndexWithTextArrayCorrect: Array<TextAudioIndexWithText> = [];
  checkedTextAudioIndexWithTextArrayWrong: Array<TextAudioIndexWithText> = [];
  checkedTextAudioIndexWithTextArraySkipped: Array<TextAudioIndexWithText> = [];
  available = false;
  isPlaying = false;
  carouselIndex = 0;
  skip = 0;
  correct = 1;
  wrong = 2;
  numberCorrect = 0;
  numberWrong = 0;
  numberSkipped = 0;
  progress = 0;

  ngOnInit() {
    this.initCarousel();
    this.initSessionCheckData();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'p') {
      this.play();
    } else if (event.key === 'c') {
      this.setCheckedType(1);
    } else if (event.key === 'w') {
      this.setCheckedType(2);
    } else if (event.key === 's') {
      this.setCheckedType(0);
    }
  }

  setCheckedType(checkType: number): void {
    this.addNumberOfCheckType(checkType);
    this.prepareNextSlide(checkType);
    this.checkedTextAudioIndexWithTextArrayCorrect.push(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText);
    this.nextSlide();
    this.loadNextAudioFile();
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
    this.apiService.loadAudioBlob(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText);
    // @ts-ignore
    this.audioPlayer.nativeElement.src = this.apiService.blobUrl.changingThisBreaksApplicationSecurity;
    this.audioPlayer.nativeElement.load();
  }

  nextSlide(): void {
    this.carousel.slideNext();
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

  play(): void {
    this.resetAudioProgress();
    this.calculateAudioPlayerStatus();
    if (!this.isPlaying) {
      this.isPlaying = !this.isPlaying;
      this.setAudioPlayerStartTime();
      this.setAudioPlayerEndTime();
      this.audioPlayer.nativeElement.play();
    } else {
      this.audioPlayer.nativeElement.pause();
      this.isPlaying = !this.isPlaying;
    }
  }

  resetAudioProgress(): void {
    this.progress = 0;
  }

  setAudioPlayerStartTime(): void {
    this.audioPlayer.nativeElement.currentTime = this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.audioStartPos / this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.samplingRate;
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
        this.apiService.loadAudioBlob(currentCheckIndex);
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
        this.checkIndexArray.push(new CheckIndex(this.carouselIndex, labeledTextAudioIndex));
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
        this.checkIndexArray.push(new CheckIndex(this.carouselIndex, l));
        this.carouselIndex++;
      } else {
        this.available = false;
      }
    }), () => {
    }, () => {
      if (this.checkIndexArray.length !== 0) {
        this.apiService.loadAudioBlob(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText);
      }
    });
  }

  resetCarousel(): void {
    this.checkIndexArray = [];
    this.checkedTextAudioIndexWithTextArrayCorrect = [];
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
