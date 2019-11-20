import {Component, OnInit} from '@angular/core';
import {TranscriptPreviewComponent} from '../transcript-preview/transcript-preview.component';
import {MatDialog} from '@angular/material/dialog';
import WaveSurfer from 'wavesurfer.js';
import MicrophonesPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.js';

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

  constructor(
    public dialog: MatDialog
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
      this.waveSurfer.microphone.on('deviceReady', stream => {
        // @ts-ignore
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = event => {
          this.waveSurfer.loadBlob(event.data);
        };
        this.mediaRecorder.start();
      });
    }
  }

  startRecord(): void {
    this.waveSurfer.microphone.start();
  }

  stopRecord(): void {
    this.mediaRecorder.stop();
    this.waveSurfer.microphone.pause();
  }

  playRecord(): void {
    this.waveSurfer.play();
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
