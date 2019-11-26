import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Recording} from '../../../models/Recording';
import WaveSurfer from 'wavesurfer.js';
import {ExportToCsv} from 'export-to-csv';
import {log} from 'util';

@Component({
  selector: 'app-recordings-overview',
  templateUrl: './recordings-overview.component.html',
  styleUrls: ['./recordings-overview.component.scss']
})
export class RecordingsOverviewComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private ref: ChangeDetectorRef
  ) {
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns = ['id', 'text', 'userId'];
  dataSource = new MatTableDataSource<{ id: number, text: string, userId: number }>();
  dummyRecording = new Recording(-1, '', -1, null);
  waveSurfer: WaveSurfer = null;
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

  ngOnInit() {
    this.apiService.getAllRecordingData().subscribe(recordings => {
      this.dataSource = new MatTableDataSource<{ id: number, text: string, userId: number }>(recordings);
    });
  }

  previewElement(recordingId: number): void {
    this.isPlaying = false;
    this.waveSurferIsReady = false;
    this.generateWaveform(recordingId);
  }

  generateWaveform(recordingId: number): void {
    this.load(recordingId);
  }

  private load(recordingId: number) {
    if (this.waveSurfer === null) {
      this.createWaveform();
    }
    this.apiService.getRecordingAudioById(recordingId).subscribe(resp => {
      this.waveSurfer.load(URL.createObjectURL(resp));
    });
  }

  createWaveform(): void {
    Promise.resolve(null).then(() => {
      this.waveSurfer = WaveSurfer.create({
        container: '#waveform',
        backend: 'MediaElement',
        waveColor: 'lightblue',
        progressColor: 'blue',
        barHeight: 1,
        autoCenter: true,
        partialRender: false,
        normalize: false,
        responsive: true
      });
      this.waveSurfer.on('waveform-ready', () => {
        log('ready');
        this.waveSurferIsReady = true;
        this.ref.detectChanges();
      });
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

  generateTable(): void {
    this.apiService.getAllRecordingData().subscribe(data => data.forEach(l => {
        this.data.push({
          id: l.id,
          text: l.text,
          userId: l.userId
        });
      }), () => {
      }
      , () => this.csvExporter.generateCsv(this.data));
  }
}
