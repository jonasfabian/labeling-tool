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

  constructor() { }

  waveSurfer: WaveSurfer = null;
  paused = false;
  snip = new Snippet(-1, -1);

  @Output() snippet = new EventEmitter<Snippet>();

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
            opacity: 1
          }),
          RegionsPlugin.create({
            regions: [
              {
                start: 1,
                end: 3,
                color: 'hsla(200, 50%, 70%, 0.4)'
              }
            ]
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

  selectStartTime(): void {
    this.snip = new Snippet(-1, -1);
    this.snip.startTime = this.waveSurfer.getCurrentTime();
  }

  selectEndTime(): void {
    if (this.snip.startTime !== -1) {
      this.snip.endTime = this.waveSurfer.getCurrentTime();
      this.snippet.emit(this.snip);
    }
  }
}
