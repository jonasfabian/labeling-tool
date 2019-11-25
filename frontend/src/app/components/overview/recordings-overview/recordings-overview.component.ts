import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Recording} from '../../../models/Recording';
import WaveSurfer from 'wavesurfer.js';

@Component({
  selector: 'app-recordings-overview',
  templateUrl: './recordings-overview.component.html',
  styleUrls: ['./recordings-overview.component.scss']
})
export class RecordingsOverviewComponent implements OnInit {

  constructor(
    private apiService: ApiService
  ) {
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns = ['id', 'text', 'userId'];
  dataSource = new MatTableDataSource<{id: number, text: string, userId: number}>();
  dummyRecording = new Recording(-1, '', -1, null);
  waveSurfer: WaveSurfer = null;

  ngOnInit() {
    this.createWaveform();
    this.apiService.getAllRecordingData().subscribe(recordings => {
      this.dataSource = new MatTableDataSource<{id: number, text: string, userId: number}>(recordings);
    });
  }

  previewElement(recordingId: number): void {
    this.apiService.getRecordingAudioById(recordingId).subscribe(l => {
      this.waveSurfer.load(URL.createObjectURL(l));
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
      responsive: true
    });
  }

  playRecording(): void {
    this.waveSurfer.play();
  }

  pauseRecording(): void {
    this.waveSurfer.pause();
  }
}
