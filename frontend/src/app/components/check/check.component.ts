import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../services/auth.service';
import {CheckMoreComponent} from './check-more/check-more.component';
import {ShortcutComponent} from './shortcut/shortcut.component';
import {HttpClient} from '@angular/common/http';
import {TextAudioDto} from '../../models/text-audio-dto';
import {environment} from '../../../environments/environment';
import {CarouselComponent} from 'ngx-carousel-lib';
import {CheckedTextAudio, CheckedTextAudioLabel} from '../../models/user-and-text-audio';
import {Router} from '@angular/router';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss']
})
export class CheckComponent implements OnInit {
  isPlaying = false;
  textAudios: Array<TextAudioDto> = [];
  audioProgress = 0;
  checkedTextAudioLabel = CheckedTextAudioLabel;
  @ViewChild('carousel') private carousel: CarouselComponent;
  private audioPlayer = new Audio();
  private isReady = false;
  private userId: number;
  // TODO replace dummy id with real one
  private groupId = 1;

  constructor(private httpClient: HttpClient, private dialog: MatDialog, private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => this.userId = user.principal.user.id);
    this.getTenNonLabeledTextAudios();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'p') {
      this.togglePlay();
    } else if (event.key === 'c') {
      this.setCheckedType(CheckedTextAudioLabel.CORRECT);
    } else if (event.key === 'w') {
      this.setCheckedType(CheckedTextAudioLabel.WRONG);
    } else if (event.key === 's') {
      this.setCheckedType(CheckedTextAudioLabel.SKIPPED);
    }
  }

  /**
   * set the checked type and prepare the next carousel
   */
  setCheckedType(checkType: CheckedTextAudioLabel): void {
    // only trigger this method if the user has played the audio at least once to prevent accidental button presses
    if (this.isReady) {
      this.stop();

      const textAudio = this.textAudios[this.carousel.carousel.activeIndex];
      const cta = new CheckedTextAudio(undefined, textAudio.id, this.userId, checkType);
      this.httpClient.post(`${environment.url}user_group/${this.groupId}/checked_text_audio`, cta).subscribe();

      // checkIfFinishedChunk
      if (this.carousel.carousel.activeIndex === this.textAudios.length - 1) {
        this.dialog.open(CheckMoreComponent, {width: '500px', disableClose: true}).afterClosed().subscribe(result => {
          if (result) {
            // reset carousel and load new data
            this.carousel.carousel.activeIndex = 0;
            this.textAudios = [];
            this.getTenNonLabeledTextAudios();
          } else {
            this.router.navigate(['/home']);
          }
        });
      } else {
        this.isReady = false;
        this.loadAudioBlob(this.textAudios[this.carousel.carousel.activeIndex + 1]);
        this.carousel.slideNext();
      }
    }
  }

  togglePlay() {
    this.isReady = true;
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  }

  openShortcutDialog = () => this.dialog.open(ShortcutComponent, {width: '500px', disableClose: false});

  private play() {
    this.audioPlayer.play();
    this.isPlaying = true;
  }

  private stop() {
    this.audioPlayer.pause();
    this.audioPlayer.currentTime = 0;
    this.audioProgress = 0;
    this.isPlaying = false;
  }

  private getTenNonLabeledTextAudios() {
    this.httpClient.get<Array<TextAudioDto>>(`${environment.url}user_group/${this.groupId}/text_audio/next`).subscribe(textAudios => {
      this.textAudios = textAudios;
      if (textAudios.length > 0) {
        this.loadAudioBlob(textAudios[0]);
      }
    });
  }

  private loadAudioBlob(dto: TextAudioDto): void {
    this.httpClient.get(`${environment.url}user_group/${this.groupId}/text_audio/audio/${dto.id}`, {responseType: 'blob'})
      .subscribe(resp => {
        this.audioPlayer = new Audio(URL.createObjectURL(resp));
        this.audioPlayer.onended = () => this.isPlaying = false;
        this.audioPlayer.ontimeupdate = () => this.audioProgress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
      });
  }
}
