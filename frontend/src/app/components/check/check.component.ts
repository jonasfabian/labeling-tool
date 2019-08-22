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

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'p') {
      this.play();
    } else if (event.key === 'c') {
      this.setCorrect();
    } else if (event.key === 'w') {
      this.setWrong();
    } else if (event.key === 's') {
      this.setSkip();
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

  openShortcutDialog(): void {
    this.dialog.open(ShortcutComponent, {width: '500px'});
  }

  openSessionOverview(): void {
    this.dialog.open(SessionOverviewComponent, {width: '500px'});
  }

  openCheckMoreDialog(): void {
    this.dialog.open(CheckMoreComponent, {width: '500px'}).afterClosed().subscribe(() => {
      this.resetCarousel();
    });
  }

  setCorrect(): void {
    this.numberCorrect++;
    this.getInfo(this.correct);
    this.checkedTextAudioIndexWithTextArrayCorrect.push(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText);
    this.carousel.slideNext();
    this.apiService.loadAudioBlob(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText);
    // @ts-ignore
    this.audioPlayer.nativeElement.src = this.apiService.blobUrl.changingThisBreaksApplicationSecurity;
    this.audioPlayer.nativeElement.load();
  }

  setWrong(): void {
    this.numberWrong++;
    this.getInfo(this.wrong);
    this.checkedTextAudioIndexWithTextArrayWrong.push(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText);
    this.carousel.slideNext();
    this.apiService.loadAudioBlob(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText);
    // @ts-ignore
    this.audioPlayer.nativeElement.src = this.apiService.blobUrl.changingThisBreaksApplicationSecurity;
    this.audioPlayer.nativeElement.load();
  }

  setSkip(): void {
    this.numberSkipped++;
    this.getInfo(this.skip);
    this.checkedTextAudioIndexWithTextArraySkipped.push(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText);
    this.carousel.slideNext();
    this.apiService.loadAudioBlob(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText);
    // @ts-ignore
    this.audioPlayer.nativeElement.src = this.apiService.blobUrl.changingThisBreaksApplicationSecurity;
    this.audioPlayer.nativeElement.load();
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
    this.progress = 0;
    this.audioPlayerStatus();
    if (!this.isPlaying) {
      this.isPlaying = !this.isPlaying;
      this.audioPlayer.nativeElement.currentTime = this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.audioStartPos / this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.samplingRate;
      this.audioPlayer.nativeElement.addEventListener('timeupdate', () => {
        if (this.audioPlayer.nativeElement.currentTime > this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.audioEndPos / this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.samplingRate) {
          this.audioPlayer.nativeElement.pause();
          this.isPlaying = false;
        }
      });
      this.audioPlayer.nativeElement.play();
    } else {
      this.audioPlayer.nativeElement.pause();
      this.isPlaying = !this.isPlaying;
    }
  }

  audioPlayerStatus(): void {
    this.progress = 0;
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

  getInfo(labeledType: number): void {
    this.progress = 0;
    this.updateSessionCheckData();
    if (this.carousel.carousel.activeIndex === this.checkIndexArray.length - 1) {
      const val = this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText;
      this.apiService.updateTextAudioIndex(new TextAudioIndexWithText(
        val.id, val.samplingRate, val.textStartPos, val.textEndPos,
        val.audioStartPos, val.audioEndPos, val.speakerKey,
        1, val.correct + 1, val.wrong, val.transcriptFileId, val.text
      )).subscribe(_ => {
        this.apiService.createUserAndTextAudioIndex(new UserAndTextAudioIndex(-1, this.authService.loggedInUser.id, val.id)).subscribe(() => {
        });
      });
      this.apiService.showTenMoreQuest = true;
      this.openCheckMoreDialog();
    } else {
      if (labeledType === 1) {
        const val = this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText;
        this.apiService.updateTextAudioIndex(new TextAudioIndexWithText(
          val.id, val.samplingRate, val.textStartPos, val.textEndPos,
          val.audioStartPos, val.audioEndPos, val.speakerKey,
          1, val.correct + 1, val.wrong, val.transcriptFileId, val.text
        )).subscribe(_ => {
          this.apiService.createUserAndTextAudioIndex(new UserAndTextAudioIndex(-1, this.authService.loggedInUser.id, val.id)).subscribe(() => {
          }, () => {
          }, () => {
            this.apiService.loadAudioBlob(val);
          });
        });
      } else if (labeledType === 2) {
        const val = this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText;
        this.apiService.updateTextAudioIndex(new TextAudioIndexWithText(
          val.id, val.samplingRate, val.textStartPos, val.textEndPos,
          val.audioStartPos, val.audioEndPos, val.speakerKey,
          1, val.correct, val.wrong + 1, val.transcriptFileId, val.text
        )).subscribe(_ => {
          this.apiService.createUserAndTextAudioIndex(new UserAndTextAudioIndex(-1, this.authService.loggedInUser.id, val.id)).subscribe(() => {
          }, () => {
          }, () => {
            this.apiService.loadAudioBlob(val);
          });
        });
      }
    }
  }

  resetCarousel(): void {
    this.checkIndexArray = [];
    this.checkedTextAudioIndexWithTextArrayCorrect = [];
    this.initCarousel();
    this.carousel.carousel.activeIndex = 0;
  }
}
