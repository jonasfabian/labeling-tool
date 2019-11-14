import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {

  constructor(
    public sanitizer: DomSanitizer
  ) {
  }

  // @ts-ignore
  mediaRecorder: MediaRecorder;
  audioChunks = [];
  audioBlob: Blob;
  audioUrl = '';

  ngOnInit() {
    navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
      // @ts-ignore
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.addEventListener('dataavailable', event => {
        this.audioChunks.push(event.data);
      });
      this.mediaRecorder.addEventListener('stop', () => {
        this.audioBlob = new Blob(this.audioChunks);
        this.audioUrl = URL.createObjectURL(this.audioBlob);
      });
    });
  }

  startRecording(): void {
    this.mediaRecorder.start();
  }

  stopRecording(): void {
    this.mediaRecorder.stop();
  }

  playRecording(): void {
    const audio = new Audio(this.audioUrl);
    audio.play();
  }
}
