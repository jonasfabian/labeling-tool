import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {

  constructor() {
  }

  audio = new Audio();
  audioUrl = '';

  ngOnInit() {
  }

  record(): void {
    navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
      // @ts-ignore
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      const audioChunks = [];
      mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
      });

      setTimeout(() => {
        mediaRecorder.stop();
      }, 3000);

      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks);
        this.setAudioUrl(audioBlob);
      });
    });
  }

  setAudioUrl(audioBlob: Blob): void {
    this.audioUrl = URL.createObjectURL(audioBlob);
  }

  playRecording(): void {
    this.audio = new Audio(this.audioUrl);
    this.audio.play();
  }

}
