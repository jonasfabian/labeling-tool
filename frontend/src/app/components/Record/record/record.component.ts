import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {

  constructor() {
  }

  // @ts-ignore
  mediaRecorder: MediaRecorder;
  audioChunks = [];
  audioUrl = '';
  audio: any;

  ngOnInit() {
  }

  startRecording(): void {
    navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
      // @ts-ignore
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.start();
      this.mediaRecorder.addEventListener('dataavailable', event => {
        this.audioChunks.push(event.data);
      });
      this.mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(this.audioChunks);
        this.audioUrl = URL.createObjectURL(audioBlob);
        this.audio = new Audio(this.audioUrl);
      });
    });
  }

  stopRecording() {
    return new Promise(resolve => {
      this.mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(this.audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        cont play = () => {
          audio.play();
        };
        resolve({audioBlob, audioUrl, play});
      });
    });
  }

  playRecording(): void {
    this.audio.play();
  }
}
