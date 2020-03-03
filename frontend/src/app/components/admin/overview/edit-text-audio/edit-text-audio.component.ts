import {ChangeDetectorRef, Component, ElementRef, Input, OnChanges, ViewChild} from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import {TextAudioDto} from '../../../../models/text-audio-dto';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-edit-text-audio',
  templateUrl: './edit-text-audio.component.html',
  styleUrls: ['./edit-text-audio.component.scss']
})
export class EditTextAudioComponent implements OnChanges {
  //TODO simplify
  @ViewChild('textAreaText') textAreaText: ElementRef<HTMLTextAreaElement>;
  @Input() textAudioId: number;
  showAll = true;
  waveSurfer: WaveSurfer = null;
  isEditText = false;
  // TODO not sure this make sense -> would need deep copy
  dummyTextAudio = new TextAudioDto(0, 0, 0, '');
  dummy = new TextAudioDto(0, 0, 0, '');
  dummyRecording: TextAudioDto;
  text = '';
  isPlaying = false;
  waveSurferIsReady = false;
  textAudio: TextAudioDto;
  private currentFileId: number;

  constructor(private det: ChangeDetectorRef, private httpClient: HttpClient) {
  }

  ngOnChanges(): void {
    //TODO load the text audio blob etc.
    this.loadAudioBlob(this.textAudioId);
    const textAudio = this.textAudio;
    // generateWaveform
    Promise.resolve(null).then(() => {
      if (this.waveSurfer === null) {
        // createWaveform
        this.waveSurfer = WaveSurfer.create({
          container: '#waveform',
          backend: 'MediaElement',
          waveColor: 'lightblue',
          progressColor: 'blue',
          barHeight: 1,
          autoCenter: true,
          partialRender: false,
          normalize: false,
          responsive: true,
          plugins: [
            RegionsPlugin.create({
              regions: []
            })
          ]
        });
        this.load(textAudio);
      } else {
        this.isPlaying = false;
        // TODO fix code
        if (this.currentFileId !== 0) {// textAudio.fileid
          this.load(textAudio);
        } else {
          this.addRegion(textAudio, false);
          this.setViewToRegion(textAudio);
          this.text = textAudio.text;
        }
      }
    });
  }

  toggleEdit(): void {
    if (this.isEditText) {
      // cancelEdit
      this.isEditText = false;
      this.addRegion(this.dummy, false);
    } else {
      // edit
      this.isEditText = true;
      if (this.showAll) {
        this.addRegion(this.dummyTextAudio, true);
        this.dummy = this.dummyTextAudio;
      }
    }
  }

  togglePlay(): void {
    if (this.isPlaying) {
      this.waveSurfer.pause();
    } else {
      this.waveSurfer.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  setViewToRegion(textAudio: TextAudioDto): void {
    this.waveSurfer.zoom(50);
    const diff = textAudio.audioStart - textAudio.audioEnd;
    const centre = textAudio.audioStart + (diff / 2);
    const fin = (centre / this.waveSurfer.getDuration());
    this.waveSurfer.seekAndCenter(fin);
  }

  submitChange() {
    if (this.showAll) {
      this.dummyTextAudio.text = this.text = this.textAreaText.nativeElement.value;
      this.updateTextAudio(this.dummyTextAudio).subscribe();
      this.addRegion(this.dummyTextAudio, false);
    } else {
      this.dummyRecording.text = this.text = this.textAreaText.nativeElement.value;
      this.updateRecording(this.dummyRecording.id, this.dummyRecording.text).subscribe();
    }
    this.isEditText = !this.isEditText;
  }

  setVolume = (volume: any) => this.waveSurfer.setVolume(volume.value / 100);

  private addRegion(textAudio: TextAudioDto, draw: boolean): void {
    this.waveSurfer.clearRegions();
    const region = this.waveSurfer.addRegion({
      start: textAudio.audioStart,
      end: textAudio.audioEnd,
      resize: draw,
      drag: draw,
      color: 'hsla(200, 50%, 70%, 0.4)'
    });
    region.on('update-end', () => {
      this.dummyTextAudio.audioStart = region.start;
      this.dummyTextAudio.audioEnd = region.end;
    });
  }

  private loadAudioBlob(fileId: number): void {
    if (this.showAll) {
      this.getAudioFile(fileId).subscribe(resp => {
        this.waveSurfer.load(URL.createObjectURL(resp));
      });
    } else {
      this.getRecordingAudioById(fileId).subscribe(resp => {
        this.waveSurfer.load(URL.createObjectURL(resp));
      });
    }
  }

  private getRecordingAudioById(id: number): Observable<any> {
    // @ts-ignore
    return this.httpClient.get<Blob>(environment.url + 'getRecordingAudioById?id=' + id, {responseType: 'blob'});
  }

  private updateTextAudio(textAudio: TextAudioDto): Observable<any> {
    return this.httpClient.post(environment.url + 'updateTextAudio', textAudio);
  }

  private updateRecording(id: number, text: string): Observable<any> {
    return this.httpClient.post(environment.url + 'updateRecording', {id, text});
  }

  private getAudioFile(fileId: number): Observable<any> {
    return this.httpClient.get(environment.url + 'getAudio?id=' + fileId, {responseType: 'blob'});
  }

  private load(textAudio: any) {

  }
}
