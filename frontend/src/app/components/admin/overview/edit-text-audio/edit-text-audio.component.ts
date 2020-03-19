import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import {HttpClient} from '@angular/common/http';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import {TextAudioDto} from '../../../../models/text-audio-dto';
import {environment} from '../../../../../environments/environment';
import {OverviewOccurrence} from '../overview-occurrence';
import {UserGroupService} from '../../../../services/user-group.service';

@Component({
  selector: 'app-edit-text-audio',
  templateUrl: './edit-text-audio.component.html',
  styleUrls: ['./edit-text-audio.component.scss']
})
export class EditTextAudioComponent implements OnChanges {
  @Input() overviewOccurrence: OverviewOccurrence;
  @Output() cancelEmit = new EventEmitter();
  @Output() successEmit = new EventEmitter();
  isPlaying = false;
  textAudio: TextAudioDto;
  textAudioCopy: TextAudioDto;
  private waveSurfer: WaveSurfer = null;
  private baseUrl: string;

  constructor(private det: ChangeDetectorRef, private httpClient: HttpClient, private userGroupService: UserGroupService) {
  }

  ngOnChanges(): void {
    this.baseUrl = `${environment.url}user_group/${this.userGroupService.userGroupId}/`;
    if (this.waveSurfer) {
      this.load(this.overviewOccurrence);
    } else {
      Promise.resolve(null).then(() => {
        // createWaveform
        this.waveSurfer = WaveSurfer.create({
          container: '#waveform',
          backend: 'MediaElement',
          waveColor: 'lightblue',
          progressColor: 'blue',
          barHeight: 1,
          autoCenter: true,
          partialRender: false,
          normalize: false,
          responsive: true,
          plugins: [
            RegionsPlugin.create({
              regions: []
            })
          ]
        });
        this.load(this.overviewOccurrence);
      });
    }
  }

  togglePlay(): void {
    if (this.isPlaying) {
      this.waveSurfer.pause();
    } else {
      this.waveSurfer.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  setViewToRegion(): void {
    this.waveSurfer.zoom(50);
    const diff = this.textAudio.audioStart - this.textAudio.audioEnd;
    const centre = this.textAudio.audioStart + (diff / 2);
    const fin = (centre / this.waveSurfer.getDuration());
    this.waveSurfer.seekAndCenter(fin);
  }

  submitChange() {
    this.httpClient.put(`${this.baseUrl}admin/text_audio/`, this.textAudio).subscribe(value => this.successEmit.emit());
  }

  setVolume = (volume: any) => this.waveSurfer.setVolume(volume.value / 100);
  cancelEdit = () => this.cancelEmit.emit();

  private addRegion(): void {
    this.waveSurfer.clearRegions();
    const region = this.waveSurfer.addRegion({
      start: this.textAudio.audioStart,
      end: this.textAudio.audioEnd,
      resize: true,
      drag: true,
      color: 'hsla(200, 50%, 70%, 0.4)'
    });
    region.on('update-end', () => {
      this.textAudio.audioStart = region.start;
      this.textAudio.audioEnd = region.end;
      this.setViewToRegion();
    });
  }

  private load(overviewOccurrence: OverviewOccurrence) {
    this.httpClient.get<TextAudioDto>(`${this.baseUrl}admin/text_audio/${overviewOccurrence.id}`).subscribe(ta => {
      this.httpClient.get(`${this.baseUrl}admin/text_audio/audio/${ta.id}`, {responseType: 'blob'}).subscribe(resp => {
        this.waveSurfer.load(URL.createObjectURL(resp));
        this.textAudio = ta;
        this.textAudioCopy = JSON.parse(JSON.stringify(this.textAudio));
        this.waveSurfer.on('ready', () => {
          this.addRegion();
          this.setViewToRegion();
        });
        this.waveSurfer.on('finish', () => {
          this.isPlaying = false;
        });
      });
    });
  }

  restore() {
    this.textAudio = JSON.parse(JSON.stringify(this.textAudioCopy));
    this.addRegion();
    this.setViewToRegion();
  }
}
