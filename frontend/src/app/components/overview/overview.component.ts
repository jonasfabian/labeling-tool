import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {TextAudio} from '../../models/TextAudio';
import {MatPaginator, MatSlider, MatSort, MatTableDataSource} from '@angular/material';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import {ExportToCsv} from 'export-to-csv';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  @ViewChild('textAreaText', {static: false}) textAreaText: ElementRef<HTMLTextAreaElement>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('volumeSlider', {static: false}) volumeSlider: MatSlider;
  showAll = true;
  dataSource = new MatTableDataSource<TextAudio | { id: number, text: string, username: string, time: string }>();
  allColumns = ['id', 'audioStart', 'audioEnd', 'text', 'fileId', 'speaker', 'labeled', 'correct', 'wrong'];
  recordingColumns = ['id', 'text', 'time', 'username'];
  waveSurfer: WaveSurfer = null;
  isEditText = false;
  dummyTextAudio = new TextAudio(0, 0, 0, '', 0, '', 0, 0, 0);
  dummy = new TextAudio(0, 0, 0, '', 0, '', 0, 0, 0);
  dummyRecording: { id: number, text: string, username: string, time: string };
  currentFileId = -1;
  text = '';
  isPlaying = false;
  waveSurferIsReady = false;
  data = [];
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true
  };
  csvExporter = new ExportToCsv(
    this.options
  );

  constructor(
    private apiService: ApiService,
    private det: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.apiService.getTextAudios().subscribe(textAudio => {
      this.dataSource = new MatTableDataSource<TextAudio>(textAudio);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  previewElement(row: any): void {
    this.isEditText = false;
    if (this.waveSurfer !== null) {
      this.waveSurfer.pause();
      this.isPlaying = false;
    }
    if (row.audioStart !== undefined) {
      this.dummyTextAudio = row;
    } else {
      this.dummyRecording = row;
    }
    this.generateWaveform(row);
  }

  toggleChangeView(): void {
    this.waveSurferIsReady = false;
    if (this.waveSurfer !== null) {
      this.waveSurfer.destroy();
      this.waveSurfer = null;
    }
    this.showAll = !this.showAll;
    if (!this.showAll) {
      this.apiService.getAllRecordingData().subscribe(recordings => {
        this.dataSource = new MatTableDataSource<{ id: number, text: string, time: string, username: string }>(recordings);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    } else {
      this.apiService.getTextAudios().subscribe(textAudio => {
        this.dataSource = new MatTableDataSource<TextAudio>(textAudio);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  }

  toggleEdit(): void {
    if (this.isEditText) {
      this.cancelEdit();
    } else {
      this.edit();
    }
  }

  generateWaveform(textAudio: any): void {
    Promise.resolve(null).then(() => {
      if (this.waveSurfer === null) {
        this.createWaveform();
        this.load(textAudio);
      } else {
        this.isPlaying = false;
        if (this.currentFileId !== textAudio.fileId) {
          this.load(textAudio);
        } else {
          this.addRegion(textAudio, false);
          this.setViewToRegion(textAudio);
          this.text = textAudio.text;
        }
      }
    });
  }

  createWaveform(): void {
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
  }

  addRegion(textAudio: TextAudio, draw: boolean): void {
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

  togglePlay(): void {
    if (this.isPlaying) {
      this.waveSurfer.pause();
    } else {
      this.waveSurfer.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  setVolume(volume: any): void {
    this.waveSurfer.setVolume(volume.value / 100);
  }

  setViewToRegion(textAudio: TextAudio): void {
    this.waveSurfer.zoom(50);
    const diff = textAudio.audioStart - textAudio.audioEnd;
    const centre = textAudio.audioStart + (diff / 2);
    const fin = (centre / this.waveSurfer.getDuration());
    this.waveSurfer.seekAndCenter(fin);
  }

  loadAudioBlob(fileId: number): void {
    if (this.showAll) {
      this.apiService.getAudioFile(fileId).subscribe(resp => {
        this.waveSurfer.load(URL.createObjectURL(resp));
      });
    } else {
      this.apiService.getRecordingAudioById(fileId).subscribe(resp => {
        this.waveSurfer.load(URL.createObjectURL(resp));
      });
    }
  }

  edit(): void {
    this.isEditText = true;
    if (this.showAll) {
      this.addRegion(this.dummyTextAudio, true);
      this.dummy = this.dummyTextAudio;
    }
  }

  submitChange(): void {
    if (this.showAll) {
      this.dummyTextAudio.text = this.text = this.textAreaText.nativeElement.value;
      this.apiService.updateTextAudio(this.dummyTextAudio).subscribe();
      this.addRegion(this.dummyTextAudio, false);
    } else {
      this.dummyRecording.text = this.text = this.textAreaText.nativeElement.value;
      this.apiService.updateRecording(this.dummyRecording.id, this.dummyRecording.text).subscribe();
    }
    this.isEditText = !this.isEditText;
  }

  cancelEdit(): void {
    this.isEditText = false;
    this.addRegion(this.dummy, false);
  }

  generateTable(): void {
    this.apiService.getTextAudios().subscribe(textAudio => textAudio.forEach(l => {
        this.data.push({
          id: l.id,
          audioStart: l.audioStart,
          audioEnd: l.audioEnd,
          text: l.text,
          fileId: l.fileId,
          speaker: l.speaker,
          labeled: l.labeled,
          correct: l.correct,
          wrong: l.wrong,
        });
      }), () => {
      }
      , () => this.csvExporter.generateCsv(this.data));
  }

  private load(textAudio) {
    if (textAudio.audioStart !== undefined) {
      this.currentFileId = textAudio.fileId;
      this.loadAudioBlob(textAudio.fileId);
      this.waveSurfer.on('ready', () => {
        this.addRegion(textAudio, false);
        if (this.showAll) {
          this.setViewToRegion(textAudio);
        }
        this.text = textAudio.text;
      });
    } else {
      this.currentFileId = textAudio.id;
      this.loadAudioBlob(textAudio.id);
      this.waveSurfer.on('ready', () => {
        this.waveSurfer.clearRegions();
        this.text = textAudio.text;
        this.dummy.text = textAudio.text;
        this.dummyTextAudio.text = textAudio.text;
      });
    }
    this.waveSurfer.on('waveform-ready', () => {
      this.waveSurferIsReady = true;
      this.det.detectChanges();
    });
    this.waveSurfer.on('finish', () => {
      this.isPlaying = false;
    });
  }
}
