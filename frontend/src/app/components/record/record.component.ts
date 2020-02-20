import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import MicrophonesPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.js';
import {Recording} from '../../models/recording';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {SnackBarService} from '../../services/snack-bar.service';

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
  excerpt: Excerpt=null;
  isRecording = false;
  private waveSurfer: WaveSurfer = null;
  // @ts-ignore
  private mediaRecorder: MediaRecorder;
  // TODO not sure how we want to access the groupid => url based or just sessionstorage?
  // probalby just get all avaible and then select one or just forward to public one -> url based e.g /1,2,3 etc.
  // NOTE: for now we just set the public group access
  private groupId = 1;

  constructor(private snackBarService: SnackBarService, private detector: ChangeDetectorRef, private httpClient: HttpClient) {
  }

  ngOnInit() {
    // TODO add failure message in case all recodings are done.
    this.httpClient.get<Excerpt>(`${environment.url}user_group/${this.groupId}/excerpt`).subscribe(value => this.excerpt = value);
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
    // TODO test if this works correctly -> needs a microphone
    // FIXME this may not work depending on the encoding
    formData.append(`file`, this.recordingBlob, 'audio');
    formData.append('excerptId', recording.excerptId + '');
    this.httpClient.post(`${environment.url}user_group/${this.groupId}/recording`, formData).subscribe(() => {
      this.fileContent = '';
      this.recordingBlob = null;
      this.waveSurfer.empty();
      this.hasStartedRecording = false;
      this.snackBarService.openMessage('Successfully uploaded recording');
    });
  }
}
