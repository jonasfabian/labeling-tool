import {Component, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../../services/auth.service';
import {CheckMoreComponent} from '../check-more/check-more.component';
import {ShortcutComponent} from '../shortcut/shortcut.component';
import {HttpClient} from '@angular/common/http';
import {TextAudioDto} from '../../../models/text-audio-dto';
import {environment} from '../../../../environments/environment';
import {CarouselComponent} from 'ngx-carousel-lib';
import {CheckedOccurrence, CheckedOccurrenceLabel, Occurrence} from './checked-occurrence';
import {Router} from '@angular/router';
import {UserGroupService} from '../../../services/user-group.service';

export enum OccurrenceMode {
  RECORDING = 'RECORDING', TEXT_AUDIO = 'TEXT_AUDIO'
}

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss']
})
// TODO add message in case someone is labeling textaudio but has not selected the public group?
export class CheckComponent implements OnInit {
  @Input() checkMode: OccurrenceMode;
  isPlaying = false;
  occurrences: Array<Occurrence> = [];
  audioProgress = 0;
  checkedOccurrenceLabel = CheckedOccurrenceLabel;
  @ViewChild('carousel') private carousel: CarouselComponent;
  private audioPlayer = new Audio();
  private isReady = false;
  private userId: number;
  private groupId = 1;

  constructor(
    private httpClient: HttpClient, private dialog: MatDialog, private authService: AuthService, private router: Router,
    private userGroupService: UserGroupService
  ) {
    this.groupId = this.userGroupService.userGroupId;
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
      this.setCheckedType(CheckedOccurrenceLabel.CORRECT);
    } else if (event.key === 'w') {
      this.setCheckedType(CheckedOccurrenceLabel.WRONG);
    } else if (event.key === 's') {
      this.setCheckedType(CheckedOccurrenceLabel.SKIPPED);
    }
  }

  /**
   * set the checked type and prepare the next carousel
   */
  setCheckedType(checkType: CheckedOccurrenceLabel): void {
    // only trigger this method if the user has played the audio at least once to prevent accidental button presses
    if (this.isReady) {
      this.stop();

      const textAudio = this.occurrences[this.carousel.carousel.activeIndex];
      const cta = new CheckedOccurrence(textAudio.id, this.userId, checkType, this.checkMode);
      this.httpClient.post(`${environment.url}user_group/${this.groupId}/occurrence/check`, cta).subscribe();

      // checkIfFinishedChunk
      if (this.carousel.carousel.activeIndex === this.occurrences.length - 1) {
        this.dialog.open(CheckMoreComponent, {width: '500px', disableClose: true}).afterClosed().subscribe(result => {
          if (result) {
            // reset carousel and load new data
            this.carousel.carousel.activeIndex = 0;
            this.occurrences = [];
            this.getTenNonLabeledTextAudios();
          } else {
            this.router.navigate(['/home']);
          }
        });
      } else {
        this.isReady = false;
        this.loadAudioBlob(this.occurrences[this.carousel.carousel.activeIndex + 1]);
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
    this.httpClient.get<Array<TextAudioDto>>(`${environment.url}user_group/${this.groupId}/occurrence/next?mode=${this.checkMode}`)
      .subscribe(textAudios => {
        this.occurrences = textAudios;
        if (textAudios.length > 0) {
          this.loadAudioBlob(textAudios[0]);
        }
      });
  }

  private loadAudioBlob(dto: Occurrence): void {
    this.httpClient.get(`${environment.url}user_group/${this.groupId}/occurrence/audio/${dto.id}?mode=${this.checkMode}`, {responseType: 'blob'})
      .subscribe(resp => {
        this.audioPlayer = new Audio(URL.createObjectURL(resp));
        this.audioPlayer.onended = () => this.isPlaying = false;
        this.audioPlayer.ontimeupdate = () => this.audioProgress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
      });
  }
}
