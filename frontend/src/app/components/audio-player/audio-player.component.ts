import {
  Component,
  EventEmitter, Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import {AudioSnippet} from '../../models/AudioSnippet';
import {ApiService} from '../../services/api.service';
import {TextAudioIndexWithText} from '../../models/TextAudioIndexWithText';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit, OnChanges {

  constructor(
    private apiService: ApiService
  ) {
  }

  @Input() audioPosition: AudioSnippet;
  @Input() textAudioIndexWithText: TextAudioIndexWithText;
  @Output() regionPosition = new EventEmitter<AudioSnippet>();
  @Output() uploadSuccess = new EventEmitter<boolean>();
  @Output() loading = new EventEmitter<boolean>();
  reg = new AudioSnippet(null, null);
  BASE64_MARKER = ';base64,';
  blobUrl = '';
  fileId = 0;
  waveSurfer: WaveSurfer = null;
  paused = false;
  zoomLvl = 0;
  toggleVolume = false;
  skipSound = 5;
  replaySound = -5;

  ngOnInit() {
    this.onPreviewPressed();
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

  ngOnChanges(): void {
    if (this.audioPosition.startTime !== null) {
      if (this.textAudioIndexWithText.transcriptFileId !== this.fileId) {
        this.loading.emit(true);
        this.fileId = this.textAudioIndexWithText.transcriptFileId;
        this.loadAudioBlob(this.textAudioIndexWithText.transcriptFileId);
      }
      if ((this.waveSurfer !== undefined) && (this.audioPosition.startTime !== null)) {
        this.waveSurfer.on('ready', () => {
          this.addRegion(this.audioPosition);
          this.setViewToRegion(this.audioPosition);
        });
        this.waveSurfer.on('waveform-ready', () => {
          this.loading.emit(false);
          this.setViewToRegion(this.audioPosition);
        });
        this.addRegion(this.audioPosition);
        if (this.waveSurfer.isReady) {
          this.setViewToRegion(this.audioPosition);
        }
      }
    }
  }

  setViewToRegion(snip: AudioSnippet): void {
    this.waveSurfer.zoom(50);
    const diff = snip.startTime - snip.endTime;
    const centre = snip.startTime + (diff / 2);
    const fin = (centre / this.waveSurfer.getDuration());
    this.waveSurfer.seekAndCenter(fin);
  }

  loadAudioBlob(fileId: number): void {
    this.apiService.getAudioFile(fileId).subscribe(resp => {
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

  generateWaveform(): void {
    Promise.resolve(null).then(() => {
      this.waveSurfer = WaveSurfer.create({
        container: '#waveform',
        backend: 'MediaElement',
        waveColor: 'lightblue',
        progressColor: 'blue',
        partialRender: false,
        normalize: false,
        responsive: true,
        plugins: [
          TimelinePlugin.create({
            container: '#wave-timeline'
          }),
          CursorPlugin.create({
            showTime: true,
            opacity: 1
          }),
          RegionsPlugin.create({
            regions: []
          })
        ]
      });
    });
  }

  onPreviewPressed(): void {
    if (!this.waveSurfer) {
      this.generateWaveform();
    }
  }

  play(): void {
    this.paused = true;
    this.waveSurfer.play();
  }

  pause(): void {
    this.paused = false;
    this.waveSurfer.pause();
  }

  reset(): void {
    this.waveSurfer.stop();
  }

  skip(): void {
    this.waveSurfer.skip(this.skipSound);
  }

  playBackSpeed(speed: number): void {
    this.waveSurfer.setPlaybackRate(speed);
  }

  replay(): void {
    this.waveSurfer.skip(this.replaySound);
  }

  addRegion(snip: AudioSnippet): void {
    this.waveSurfer.clearRegions();
    this.reg = new AudioSnippet(snip.startTime, snip.endTime);
    const region = this.waveSurfer.addRegion({
      start: snip.startTime,
      end: snip.endTime,
      resize: true,
      color: 'hsla(200, 50%, 70%, 0.4)'
    });
    region.on('update-end', () => {
      this.regionPosition.emit(new AudioSnippet(region.start, region.end));
    });
  }

  setVolume(volume: any): void {
    this.waveSurfer.setVolume(volume.value / 100);
  }

  zoomLevel(zoomLevel: number): void {
    if (zoomLevel <= 200 && zoomLevel >= 1) {
      this.waveSurfer.zoom(zoomLevel);
      this.zoomLvl = zoomLevel;
    }
  }

  seekInAudio(seconds: any) {
    const totalTime = this.waveSurfer.getDuration();
    this.waveSurfer.seekTo(seconds / totalTime);
  }
}
