import {Component, OnInit} from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  constructor(
  ) {
  }

  file: any;
  text: string | ArrayBuffer;
  waveSurfer: WaveSurfer = null;

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

  fileChanged(e) {
    const reader = new FileReader();
    this.file = e.target.files[0];
    reader.onload = () => {
      this.text = reader.result;
    };
    reader.readAsText(this.file);
  }
}
