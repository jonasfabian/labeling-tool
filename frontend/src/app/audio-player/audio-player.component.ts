import {
  Component,
  ElementRef,
  EventEmitter, Inject,
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
import {SafeResourceUrl} from '@angular/platform-browser';
import {ApiService} from '../services/api.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit, OnChanges {

  constructor(
    public dialog: MatDialog,
    private apiService: ApiService
  ) {
  }

  waveSurfer: WaveSurfer = null;
  paused = false;
  zoomLvl = 0;
  toggleVolume = false;

  @Output() snippet = new EventEmitter<AudioSnippet>();
  @Output() uploadSuccess = new EventEmitter<boolean>();
  audioFile: SafeResourceUrl;
  reg: any;
  BASE64_MARKER = ';base64,';
  blobUrl = '';

  ngOnInit() {
    this.onPreviewPressed();
    this.loadAudioBlob(37);
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
    this.loadAudioBlob(48);
  }

  loadAudioBlob(fileId: number): void {
    this.apiService.getAudioFile(fileId).subscribe(resp => {
      const reader = new FileReader();
      reader.readAsDataURL(resp);
      reader.addEventListener('loadend', _ => {
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
      color: 'hsla(200, 50%, 70%, 0.4)'
    });
    this.snippet.emit(new AudioSnippet(this.waveSurfer.getCurrentTime(), this.waveSurfer.getCurrentTime() + 10));
    region.on('update-end', () => this.snippet.emit(new AudioSnippet(region.start, region.end)));
  }

  deleteRegion(): void {
    this.waveSurfer.clearRegions();
    this.snippet.emit(new AudioSnippet(null, null));
    this.audioFile = '';
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

  uploadAudioFile(file: File) {
    this.audioFile = URL.createObjectURL(file);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SetTimeDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.waveSurfer.clearRegions();
      this.waveSurfer.addRegion({
        start: dialogRef.componentInstance.startTimeInput.nativeElement.value,
        end: dialogRef.componentInstance.endTimeInput.nativeElement.value,
        resize: true,
        drag: true,
        color: 'hsla(200, 50%, 70%, 0.4)'
      });
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

  closeDialog(): void {
    this.dialogRef.close();
  }
}
