import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CarouselComponent} from 'ngx-carousel-lib';
import {ApiService} from '../../services/api.service';
import {TextAudioIndexWithText} from '../../models/textAudioIndexWithText';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
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
    private sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {
  }

  yeetArray: Array<CheckIndex> = [];
  blobUrl: SafeUrl = '';
  BASE64_MARKER = ';base64,';
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
        this.yeetArray.push(new CheckIndex(this.i, l));
        this.i++;
      } else {
        this.available = false;
      }
    }), () => {
    }, () => {
      if (this.yeetArray.length !== 0) {
        this.loadAudioBlob(this.yeetArray[this.carousel.carousel.activeIndex].textAudioIndexWithText);
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
    if (this.carousel.carousel.activeIndex === this.yeetArray.length - 1) {
      this.apiService.getTenNonLabeledTextAudioIndex(1).subscribe(r => r.forEach(l => {
        l.text = l.text.slice(l.textStartPos, l.textEndPos);
        this.yeetArray.push(new CheckIndex(this.i, l));
        this.i++;
      }), () => {
      }, () => {
        this.loadAudioBlob(this.yeetArray[this.carousel.carousel.activeIndex].textAudioIndexWithText);
      });
    }
  }

  openShortcutDialog(): void {
    this.dialog.open(ShortcutComponent, {width: '500px'});
  }

  /*
  * 0 ==  not labeled
  * 1 == correct
  * 2 == wrong
  * 3 == skipped
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
    this.getInfo(3);
    this.carousel.slideNext();
  }

  play(): void {
    if (!this.isPlaying) {
      this.isPlaying = !this.isPlaying;
      this.audioPlayer.nativeElement.currentTime = this.yeetArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.audioStartPos / this.yeetArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.samplingRate;
      this.audioPlayer.nativeElement.addEventListener('timeupdate', () => {
        if (this.audioPlayer.nativeElement.currentTime > this.yeetArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.audioEndPos / this.yeetArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.samplingRate) {
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
      const val = this.yeetArray[this.carousel.carousel.activeIndex].textAudioIndexWithText;
      this.apiService.updateTextAudioIndex(new TextAudioIndexWithText(
        val.id, val.samplingRate, val.textStartPos, val.textEndPos,
        val.audioStartPos, val.audioEndPos, val.speakerKey,
        labeledType, val.correct + 1, val.wrong, val.transcriptFileId, val.text
      )).subscribe(_ => {
        this.loadAudioBlob(val);
      });
    } else if (labeledType === 2) {
      const val = this.yeetArray[this.carousel.carousel.activeIndex].textAudioIndexWithText;
      this.apiService.updateTextAudioIndex(new TextAudioIndexWithText(
        val.id, val.samplingRate, val.textStartPos, val.textEndPos,
        val.audioStartPos, val.audioEndPos, val.speakerKey,
        labeledType, val.correct, val.wrong + 1, val.transcriptFileId, val.text
      )).subscribe(_ => {
        this.loadAudioBlob(val);
      });
    } else {
      const val = this.yeetArray[this.carousel.carousel.activeIndex].textAudioIndexWithText;
      this.apiService.updateTextAudioIndex(new TextAudioIndexWithText(
        val.id, val.samplingRate, val.textStartPos, val.textEndPos,
        val.audioStartPos, val.audioEndPos, val.speakerKey,
        labeledType, val.correct, val.wrong, val.transcriptFileId, val.text
      )).subscribe(_ => {
        this.loadAudioBlob(val);
      });
    }
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

  loadAudioBlob(file: TextAudioIndexWithText): void {
    this.apiService.getAudioFile(file.transcriptFileId).subscribe(resp => {
      const reader = new FileReader();
      reader.readAsDataURL(resp);
      reader.addEventListener('loadend', _ => {
        const binary = this.convertDataURIToBinary(reader.result);
        const blob = new Blob([binary], {type: `application/octet-stream`});
        this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      });
    });
  }
}
