import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Recording} from '../../models/recording';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {SnackBarService} from '../../services/snack-bar.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Excerpt} from '../../models/excerpt';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {
  excerpt: Excerpt = null;
  isRecording = false;
  blobUrl: SafeUrl;
  // @ts-ignore
  private mediaRecorder: MediaRecorder;
  private audioChunks = [];
  // TODO get real groupId
  private groupId = 1;

  constructor(private snackBarService: SnackBarService, private detector: ChangeDetectorRef, private httpClient: HttpClient, private domSanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.getNext();
    navigator.mediaDevices.getUserMedia({audio: true})
      .then(stream => {
        // @ts-ignore
        this.mediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/webm'});
        this.mediaRecorder.ondataavailable = event => this.audioChunks.push(event.data);
        this.mediaRecorder.onstop = () => {
          this.blobUrl = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(new Blob(this.audioChunks)));
          this.detector.detectChanges();
        };
      });
  }

  startRecord(): void {
    this.audioChunks = [];
    this.mediaRecorder.start();
    this.isRecording = true;
  }

  stopRecord(): void {
    this.mediaRecorder.stop();
    this.isRecording = false;
  }

  submit(): void {
    const recording = new Recording(undefined, this.excerpt.id, undefined, undefined, undefined);
    const formData = new FormData();
    formData.append(`file`, new Blob(this.audioChunks), 'audio');
    formData.append('excerptId', recording.excerptId + '');
    this.httpClient.post(`${environment.url}user_group/${this.groupId}/recording`, formData).subscribe(() => {
      this.audioChunks = [];
      this.blobUrl = undefined;
      this.snackBarService.openMessage('Successfully uploaded recording');
      this.getNext();
    });
  }

  private() {
    // TODO not sure how we should implement this
    this.httpClient.put<Excerpt>(`${environment.url}user_group/${this.groupId}/excerpt/private`, {});
    this.snackBarService.openMessage('marked as private');
  }

  skip() {
    // TODO not sure how we should implement this
    this.httpClient.put<Excerpt>(`${environment.url}user_group/${this.groupId}/excerpt/skip`, {});
    this.snackBarService.openMessage('marked as skipped');
  }

  isReady = () => this.audioChunks.length > 0;

  private getNext() {
    this.httpClient.get<Excerpt>(`${environment.url}user_group/${this.groupId}/excerpt`).subscribe(value => this.excerpt = value);
  }
}
