import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Recording} from '../../../models/Recording';
import {AuthService} from '../../../services/auth.service';
import {TranscriptPreviewComponent} from '../transcript-preview/transcript-preview.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {
  }

  audio = new Audio();
  audioUrl = '';
  recording = false;
  playing = false;
  // @ts-ignore
  mediaRecorder: MediaRecorder;
  fileByteArray: Array<number> = [];
  yeet: any;
  fileContent: string | ArrayBuffer = '';
  showTextArea = false;

  ngOnInit() {
  }

  disableCreateButton(): boolean {
    if (this.fileByteArray.length !== 0 && this.fileContent !== '') {
      return false;
    } else {
      return true;
    }
  }

  toggle(): void {
    this.showTextArea = !this.showTextArea;
  }

  record(): void {
    this.recording = true;
    navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
      // @ts-ignore
      this.setMediaRecorder(stream);
      this.mediaRecorder.start();
      const audioChunks = [];
      this.mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
      });

      this.mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks);
        this.setAudioUrl(audioBlob);
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(audioBlob);
        fileReader.onloadend = () => {
          // @ts-ignore
          this.yeet = new Int8Array(fileReader.result);
          if (this.yeet.length <= 65535) {
            this.yeet.map(l => {
              this.fileByteArray.push(l);
            });
          }
        };
      });
    });
  }

  stopRecording(): void {
    this.recording = false;
    this.mediaRecorder.stop();
  }

  setMediaRecorder(stream: MediaStream): void {
    // @ts-ignore
    this.mediaRecorder = new MediaRecorder(stream);
  }

  setAudioUrl(audioBlob: Blob): void {
    this.audioUrl = URL.createObjectURL(audioBlob);
  }

  playRecording(): void {
    this.togglePlay();
    this.audio = new Audio(this.audioUrl);
    this.audio.play();
  }

  stopPlayRecording(): void {
    this.togglePlay();
    this.audio.pause();
  }

  togglePlay(): void {
    this.playing = !this.playing;
  }

  createRecording(): void {
    const rec =  new Recording(-1, this.fileContent.toString(), this.authService.loggedInUser.getValue().id, this.fileByteArray);
    this.apiService.createRecording(rec).subscribe();
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
