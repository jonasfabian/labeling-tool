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
  showTextArea = true;
  waveSurfer: WaveSurfer = null;
  context = new AudioContext();
  processor = this.context.createScriptProcessor(1024, 1, 1);
  // @ts-ignore
  mediaRecorder: MediaRecorder;
  recordingBlob: Blob;
  hasStartedRecording = false;
  isRecording = false;
  isPlaying = false;

  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private detector: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    if (this.waveSurfer === null) {
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
        audioContext: this.context || null,
        audioScriptProcessor: this.processor || null,
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
        this.isPlaying = false;
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

  isRecordingM(): string {
    if (this.isRecording) {
      return 'recording';
    } else {
      return '';
    }
  }

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

  playRecord(): void {
    this.waveSurfer.play();
  }

  togglePlayRecord(): void {
    this.isPlaying = !this.isPlaying;
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
    }, () => {
    }, () => {
      this.snackBar.open('Successfully created new Recording', '', {duration: 3000, panelClass: ['background-white']});
    });
  }

  handleFileInput(fileList: FileList): void {
    const file = fileList[0];
    const fileReader: FileReader = new FileReader();
    fileReader.onloadend = () => {
      this.fileContent = fileReader.result;
    };
    fileReader.readAsText(file);
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
