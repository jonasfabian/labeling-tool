import {
  Component,
  ElementRef,
  EventEmitter, Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import {AudioSnippet} from '../models/audioSnippet';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit, OnChanges {

  constructor(
    public dialog: MatDialog
  ) {
  }

  waveSurfer: WaveSurfer = null;
  paused = false;
  zoomLvl = 0;
  toggleVolume = false;

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

  addRegion(): void {
    this.waveSurfer.clearRegions();
    const region = this.reg = this.waveSurfer.addRegion({
      start: this.waveSurfer.getCurrentTime(),
      end: this.waveSurfer.getCurrentTime() + 10,
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

  openDialog(): void {
    const dialogRef = this.dialog.open(SetTimeDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

@Component({
  selector: 'app-audio-player-set-time-dialog-component',
  templateUrl: 'set-time-dialog-component.html',
})
export class SetTimeDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<SetTimeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AudioSnippet) {
  }

  @ViewChild('startTimeInput', {static: false}) startTimeInput: ElementRef;
  @ViewChild('endTimeInput', {static: false}) endTimeInput: ElementRef;

  readStartTime(input: any): void {
    console.log(this.startTimeInput.nativeElement.value);
  }

  readEndTime(input: any): void {
    console.log(this.endTimeInput.nativeElement.value);
  }

  onClick(): void {
    this.dialogRef.close();
  }
}
