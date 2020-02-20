import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
  excerpt: Excerpt = null;
  isRecording = false;
  isPlaying = false;
  // @ts-ignore
  private mediaRecorder: MediaRecorder;
  // TODO get real groupId
  private groupId = 1;
  private audioChunks = [];
  private audioPlayer = new Audio();

  constructor(private snackBarService: SnackBarService, private detector: ChangeDetectorRef, private httpClient: HttpClient) {
  }

  ngOnInit() {
    // TODO test microphone logic on multiple browsers
    // TODO add failure message in case all recordings are done.
    this.httpClient.get<Excerpt>(`${environment.url}user_group/${this.groupId}/excerpt`).subscribe(value => this.excerpt = value);
    navigator.mediaDevices.getUserMedia({audio: true})
      .then(stream => {
        // @ts-ignore
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = event => this.audioChunks.push(event.data);
        // this.mediaRecorder.onstop = () => this.recordingBlob = new Blob(this.audioChunks);
      });
  }

  isRecordingM = (): string => this.isRecording ? 'recording' : '';

  startRecord(): void {
    this.audioChunks = [];
    this.isRecording = true;
    this.mediaRecorder.start();
  }

  stopRecord(): void {
    this.mediaRecorder.stop();
    this.isRecording = false;
  }

  togglePlay() {
    if (this.isPlaying) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;
      // this.audioProgress = 0;
      this.isPlaying = false;
    } else {
      this.audioPlayer = new Audio(URL.createObjectURL(new Blob(this.audioChunks)));
      this.audioPlayer.play();
      this.isPlaying = true;
    }
  }

  submit(): void {
    const recording = new Recording(undefined, this.excerpt.id, undefined, undefined, undefined);
    const formData = new FormData();
    // TODO test if this works correctly -> needs a microphone
    // FIXME this may not work depending on the encoding
    formData.append(`file`, new Blob(this.audioChunks), 'audio');
    formData.append('excerptId', recording.excerptId + '');
    this.httpClient.post(`${environment.url}user_group/${this.groupId}/recording`, formData).subscribe(() => {
      this.fileContent = '';
      this.audioChunks = [];
      this.snackBarService.openMessage('Successfully uploaded recording');
    });
  }

  //TODO implement logic
  private() {

  }

  skip() {

  }
}
