import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {TranscriptPreviewComponent} from '../transcript-preview/transcript-preview.component';
import {MatDialog} from '@angular/material/dialog';
import WaveSurfer from 'wavesurfer.js';
import MicrophonesPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.js';
import {ApiService} from '../../../services/api.service';
import {Recording} from '../../../models/Recording';
import {AuthService} from '../../../services/auth.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {
  fileContent: string | ArrayBuffer = '';
  recordingBlob: Blob;
  hasStartedRecording = false;
  private isRecording = false;
  private waveSurfer: WaveSurfer = null;
  // @ts-ignore
  private mediaRecorder: MediaRecorder;

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private detector: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
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
        };
        this.mediaRecorder.start();
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
    if (this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.waveSurfer.microphone.pause();
    }
  }

  recordAnotherOne(): void {
    this.fileContent = '';
    this.recordingBlob = null;
    this.waveSurfer.empty();
    this.hasStartedRecording = false;
  }

  togglePlayRecord(): void {
    if (this.waveSurfer.isPlaying()) {
      this.waveSurfer.pause();
    } else {
      this.waveSurfer.play();
    }
  }

  submit(): void {
    this.apiService.createRecording(
      new Recording(-1, this.fileContent.toString(), this.authService.loggedInUser.getValue().id, this.recordingBlob
      )).subscribe(() => {
      this.snackBar.open('Successfully created new Recording', '', {duration: 3000, panelClass: ['background-white']});
    });
  }

  handleFileInput(fileList: FileList): void {
    const file = fileList[0];
    if (file.name.includes('.txt')) {
      const fileReader: FileReader = new FileReader();
      fileReader.onloadend = () => {
        this.fileContent = fileReader.result;
      };
      fileReader.readAsText(file);
    } else {
      // FIXME why no snackbar?
      alert('Can only upload .txt files');
    }
  }

  openTranscriptPreviewDialog(): void {
    this.dialog.open(TranscriptPreviewComponent, {
      width: 'calc(100% - 1px)',
      height: 'calc(100% - 200px)',
      disableClose: false,
      data: {
        transcript: this.fileContent
      }
    });
  }
}
