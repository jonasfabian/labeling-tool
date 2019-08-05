import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CarouselComponent} from 'ngx-carousel-lib';
import {ApiService} from '../../services/api.service';
import {TextAudioIndexWithText} from '../../models/textAudioIndexWithText';
import {CheckIndex} from '../../models/checkIndex';
import {MatDialog} from '@angular/material';
import {ShortcutComponent} from '../shortcut/shortcut.component';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss']
})
export class CheckComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog
  ) {
  }

  checkIndexArray: Array<CheckIndex> = [];
  @ViewChild('carousel', {static: false}) carousel: CarouselComponent;
  @ViewChild('audioPlayer', {static: false}) audioPlayer: ElementRef;

  available = false;
  isPlaying = false;
  i = 0;

  ngOnInit() {
    this.apiService.getTenNonLabeledTextAudioIndex(1).subscribe(r => r.forEach(l => {
      if (r.length !== 0) {
        this.available = true;
        l.text = l.text.slice(l.textStartPos, l.textEndPos);
        this.checkIndexArray.push(new CheckIndex(this.i, l));
        this.i++;
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
      this.correct();
    } else if (event.key === 'w') {
      this.wrong();
    } else if (event.key === 's') {
      this.skip();
    }
  }

  lastSlide(): void {
    if (this.carousel.carousel.activeIndex === this.checkIndexArray.length - 1) {
      this.apiService.getTenNonLabeledTextAudioIndex(1).subscribe(r => r.forEach(l => {
        l.text = l.text.slice(l.textStartPos, l.textEndPos);
        this.checkIndexArray.push(new CheckIndex(this.i, l));
        this.i++;
      }), () => {
      }, () => {
        this.apiService.loadAudioBlob(this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText);
      });
    }
  }

  openShortcutDialog(): void {
    this.dialog.open(ShortcutComponent, {width: '500px'});
  }

  /*
  * 0 == not labeled
  * 1 == correct
  * 2 == wrong
  * */

  correct(): void {
    this.getInfo(1);
    this.carousel.slideNext();
  }

  wrong(): void {
    this.getInfo(2);
    this.carousel.slideNext();
  }

  skip(): void {
    this.getInfo(0);
    this.carousel.slideNext();
  }

  play(): void {
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

  getInfo(labeledType: number): void {
    if (labeledType === 1) {
      const val = this.checkIndexArray[this.carousel.carousel.activeIndex].textAudioIndexWithText;
      this.apiService.updateTextAudioIndex(new TextAudioIndexWithText(
        val.id, val.samplingRate, val.textStartPos, val.textEndPos,
        val.audioStartPos, val.audioEndPos, val.speakerKey,
        1, val.correct + 1, val.wrong, val.transcriptFileId, val.text
      )).subscribe(_ => {
        this.apiService.loadAudioBlob(val);
      });
    }
  }
}
