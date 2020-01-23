import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import MicrophonesPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.js';
import {Recording} from '../../models/recording';
import {MatSnackBar} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

interface Excerpt {
  excerpt: string;
  id: number;
  isSkipped: number;
  isPrivate: number;
  orginal_text_id: number;
}

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {
  fileContent: string | ArrayBuffer = '';
  recordingBlob: Blob;
  hasStartedRecording = false;
  excerpt: Excerpt;
  isRecording = false;
  private waveSurfer: WaveSurfer = null;
  // @ts-ignore
  private mediaRecorder: MediaRecorder;

  constructor(private snackBar: MatSnackBar, private detector: ChangeDetectorRef, private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.httpClient.get<Excerpt>(environment.url + 'api/excerpt').subscribe(value => this.excerpt = value);
    if (this.waveSurfer === null) {
      const context = new AudioContext();
      const processor = context.createScriptProcessor(1024, 1, 1);
      this.waveSurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'lightblue',
        progressColor: 'blue',
        barHeight: 1,
        autoCenter: true,
        partialRender: false,
        normalize: false,
        responsive: true,
        interact: false,
        cursorWidth: 0,
        audioContext: context,
        audioScriptProcessor: processor,
        plugins: [
          MicrophonesPlugin.create({
            bufferSize: 4096,
            numberOfInputChannels: 1,
            numberOfOutputChannels: 1,
            constraints: {
              video: false,
              audio: true
            }
          })
        ]
      });
      this.waveSurfer.on('finish', () => {
        this.detector.detectChanges();
      });
      this.waveSurfer.microphone.on('deviceReady', stream => {
        // @ts-ignore
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = event => {
          this.waveSurfer.loadBlob(event.data);
          this.recordingBlob = event.data;
          this.detector.detectChanges();
        };
      });
    }
  }

  isRecordingM = (): string => this.isRecording ? 'recording' : '';
  isPlaying = () => this.waveSurfer ? this.waveSurfer.isPlaying() : false;

  startRecord(): void {
    this.hasStartedRecording = true;
    this.isRecording = true;
    this.waveSurfer.microphone.start();
  }

  stopRecord(): void {
    this.mediaRecorder.start();
    this.mediaRecorder.stop();
    this.isRecording = false;
    this.waveSurfer.microphone.pause();
  }

  togglePlayRecord(): void {
    if (this.waveSurfer.isPlaying()) {
      this.waveSurfer.pause();
    } else {
      this.waveSurfer.play();
    }
  }

  submit(): void {
    const recording = new Recording(undefined, this.excerpt.id, undefined, undefined, undefined);
    const formData = new FormData();
    formData.append(`file`, this.recordingBlob, 'audio');
    formData.append('data', JSON.stringify(recording));
    this.httpClient.post(environment.url + 'api/recording', formData).subscribe(() => {
      this.fileContent = '';
      this.recordingBlob = null;
      this.waveSurfer.empty();
      this.hasStartedRecording = false;
      this.snackBar.open('Successfully uploaded recording', 'close', {duration: 3000});
    });

  }
}
