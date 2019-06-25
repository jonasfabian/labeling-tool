import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import {Snippet} from '../models/snippet';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit {

  constructor() {
  }

  waveSurfer: WaveSurfer = null;
  paused = false;

  @Output() snippet = new EventEmitter<Snippet>();

  reg: any;

  ngOnInit() {
    this.onPreviewPressed();
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

  replay(): void {
    this.waveSurfer.skip(-5);
  }

  enableDrag(): void {
    this.waveSurfer.clearRegions();
    const region = this.reg = this.waveSurfer.addRegion({start: 10, end: 20, resize: true, drag: true, color: 'hsla(200, 50%, 70%, 0.4)'});
    region.on('update-end', () => this.snippet.emit(new Snippet(region.start, region.end)));
  }

  loopRegion(): void {
    this.paused = true;
    this.reg.playLoop();
  }

  setVolume(volume: any): void {
    this.waveSurfer.setVolume(volume.value / 100);
  }
}
