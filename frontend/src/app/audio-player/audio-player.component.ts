import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import {AudioSnippet} from '../models/audioSnippet';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit, OnChanges {

  constructor() {
  }

  waveSurfer: WaveSurfer = null;
  paused = false;

  @Output() snippet = new EventEmitter<AudioSnippet>();
  @Output() uploadSuccess = new EventEmitter<boolean>();
  @Input() audioFile: string;

  reg: any;

  ngOnInit() {
    this.onPreviewPressed();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.audioFile !== undefined) {
      this.waveSurfer.load(this.audioFile);
      this.uploadSuccess.emit(true);
      this.waveSurfer.on('zoom', zoom => {
        console.log(zoom);
      });
    }
  }

  generateWaveform(): void {
    Promise.resolve(null).then(() => {
      this.waveSurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'lightblue',
        progressColor: 'blue',
        responsive: true,
        plugins: [
          TimelinePlugin.create({
            container: '#wave-timeline'
          }),
          CursorPlugin.create({
            container: '#wave-cursor',
            showTime: true,
            opacity: 1,
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
    Promise.resolve().then(() => this.waveSurfer.load('../assets/song.mp3'));
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
    this.waveSurfer.skip(5);
  }

  playBackSpeed(speed: number): void {
    this.waveSurfer.setPlaybackRate(speed);
  }

  replay(): void {
    this.waveSurfer.skip(-5);
  }

  enableDrag(): void {
    this.waveSurfer.clearRegions();
    const region = this.reg = this.waveSurfer.addRegion({
      start: 10,
      end: 20,
      resize: true,
      drag: true,
      color: 'hsla(200, 50%, 70%, 0.4)'
    });
    region.on('update-end', () => this.snippet.emit(new AudioSnippet(region.start, region.end)));
  }

  loopRegion(): void {
    this.paused = true;
    this.reg.playLoop();
  }

  setVolume(volume: any): void {
    this.waveSurfer.setVolume(volume.value / 100);
  }

  zoomLevel(zoomLevel: any): void {
    this.waveSurfer.zoom(zoomLevel.value);
  }
}
