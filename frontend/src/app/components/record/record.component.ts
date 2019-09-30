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
  recording = false;
  playing = false;
  // @ts-ignore
  mediaRecorder: MediaRecorder;

  ngOnInit() {
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
}
