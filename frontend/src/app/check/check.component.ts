import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CarouselComponent} from 'ngx-carousel-lib';
import {ApiService} from '../services/api.service';
import {TextAudioIndexWithText} from '../models/textAudioIndexWithText';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss']
})
export class CheckComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private sanitizer: DomSanitizer
  ) {
  }

  yeetArray: Array<CheckIndex> = [];
  blobUrl: SafeUrl = '';
  BASE64_MARKER = ';base64,';
  @ViewChild('carousel', {static: false}) carousel: CarouselComponent;
  @ViewChild('audioPlayer', {static: false}) audioPlayer: ElementRef;

  isPlaying = false;

  ngOnInit() {
    let i = 0;
    this.apiService.getTenNonLabeledTextAudioIndex().subscribe(r => r.forEach(l => {
      l.text = l.text.slice(l.textStartPos, l.textEndPos);
      this.yeetArray.push(new CheckIndex(i, l));
      i++;
    }));
  }

  correct(): void {
    this.getInfo(1);
    this.carousel.slideNext();
  }

  wrong(): void {
    this.getInfo(0);
    this.carousel.slideNext();
  }

  play(): void {
    if (!this.isPlaying) {
      this.isPlaying = !this.isPlaying;
      this.audioPlayer.nativeElement.currentTime = this.yeetArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.audioStartPos / this.yeetArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.samplingRate;
      this.audioPlayer.nativeElement.addEventListener('timeupdate', () => {
        if (this.audioPlayer.nativeElement.currentTime > this.yeetArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.audioEndPos / this.yeetArray[this.carousel.carousel.activeIndex].textAudioIndexWithText.samplingRate) {
          this.audioPlayer.nativeElement.pause();
        }
      });
      this.audioPlayer.nativeElement.play();
    } else {
      this.audioPlayer.nativeElement.pause();
      this.isPlaying = !this.isPlaying;
    }
  }

  getInfo(correct: number): void {
    const val = this.yeetArray[this.carousel.carousel.activeIndex].textAudioIndexWithText;
    this.apiService.updateTextAudioIndex(new TextAudioIndexWithText(
      val.id, val.samplingRate, val.textStartPos, val.textEndPos,
      val.audioStartPos, val.audioEndPos, val.speakerKey,
      correct, val.transcriptFileId, val.text
    )).subscribe(_ => {
      this.loadAudioBlob(val);
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

export class CheckIndex {
  id: number;
  textAudioIndexWithText: TextAudioIndexWithText;

  constructor(id: number, textAudioIndexWithText: TextAudioIndexWithText) {
    this.id = id;
    this.textAudioIndexWithText = textAudioIndexWithText;
  }
}
