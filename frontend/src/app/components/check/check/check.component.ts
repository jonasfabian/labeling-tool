import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../../services/auth.service';
import {CheckMoreComponent} from '../check-more/check-more.component';
import {ShortcutComponent} from '../shortcut/shortcut.component';
import {HttpClient} from '@angular/common/http';
import {TextAudioDto} from '../../../models/text-audio-dto';
import {environment} from '../../../../environments/environment';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {CarouselComponent} from 'ngx-carousel-lib';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss']
})
export class CheckComponent implements OnInit {

//  TODO simplifiy whole component

// TODO why do we use both audioplayer and waveform?
//  TODO could be replaced with this https://stackoverflow.com/questions/44883501/play-sound-in-angular-4
  @ViewChild('audioPlayer', {static: false}) audioPlayer: ElementRef;
  @ViewChild('carousel') carousel: CarouselComponent;
  isPlaying = false;
  skip = 3;
  correct = 1;
  wrong = 2;
  progress = 0;
  isReady = false;
  textAudios: Array<TextAudioDto> = [];
  blobUrl: SafeUrl = '';
  private userId: number;
  // TODO replace dummy id with real one
  private groupId = 1;

  constructor(private apiService: ApiService, private httpClient: HttpClient, private dialog: MatDialog, private authService: AuthService,
              private detector: ChangeDetectorRef, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => this.userId = user.principal.id);
    // TODO load audio only once
    this.getTenNonLabeledTextAudios().subscribe(textAudios => {
      this.textAudios = textAudios;
      if (textAudios.length > 0) {
        this.loadAudioBlob(textAudios[0]);
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

  /**
   * set the checked type and prepare the next carousel
   */
  setCheckedType(checkType: number): void {
    // TODO replace checkType nuber with enum
    // TODO move to prepare and only load the required audio blob

    // TODO only trigger this method if the user has played the audio at least once to prevent accidental button presses

    this.stop();

    const textAudio = this.textAudios[this.carousel.carousel.activeIndex];
    // TODO correcly save that the label
    // this.httpClient.post(`${environment.url}user_group/${this.groupId}/text_audio/next`, {textAudioId: textAudio.id});

    // checkIfFinishedChunk
    if (this.carousel.carousel.activeIndex === this.textAudios.length - 1) {
      this.apiService.showTenMoreQuest = true;
      // TODO not sure this component makes sense as we ignore the respone anyway and instead go over the service.
      this.dialog.open(CheckMoreComponent, {width: '500px', disableClose: true}).afterClosed().subscribe(() => {
        // reset carousel
        this.progress = 0;
        this.textAudios = [];
        // TODO load new ones and actually use the right response
        // this.getTenNonLabeledTextAudios()
        this.carousel.carousel.activeIndex = 0;
      });
    } else {
      this.loadNextAudioFile();
      this.carousel.slideNext();
    }
  }

  // TODO replace with html audio
  playRegion() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  }

  // TODO not sure about performance -> maybe use the normal audio player output instead or on change?
  audioProgress = () => (this.audioPlayer.nativeElement.currentTime / this.audioPlayer.nativeElement.duration) * 100;
  openShortcutDialog = () => this.dialog.open(ShortcutComponent, {width: '500px', disableClose: false});
  private loadNextAudioFile = () => this.loadAudioBlob(this.textAudios[this.carousel.carousel.activeIndex]);

  private play() {
    this.audioPlayer.nativeElement.play();
    this.isPlaying = true;
  }

  private stop() {
    this.audioPlayer.nativeElement.pause();
    this.audioPlayer.nativeElement.currentTime = 0;
    this.isPlaying = false;
  }

  // TODO do we really need to poll them 3 times? -> simplify logic
  private getTenNonLabeledTextAudios() {
    return this.httpClient.get<Array<TextAudioDto>>(`${environment.url}user_group/${this.groupId}/text_audio/next`);
  }

  private loadAudioBlob(dto: TextAudioDto): void {
    // TODO maybe just use html5 audio? -> loading symbol does not make any sense anymore as we do not wait for the loaded audio.
    this.apiService.getAudioFile(dto.id).subscribe(resp => {
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(resp));
    });
  }
}
