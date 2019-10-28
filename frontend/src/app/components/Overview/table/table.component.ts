import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ApiService} from '../../../services/api.service';
import {TextAudio} from '../../../models/TextAudio';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {

  constructor(
    private apiService: ApiService
  ) {
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() vale: string;
  @Output() editAudio = new EventEmitter<boolean>();
  @Output() textAudio = new EventEmitter<TextAudio>();
  displayedColumns = ['id', 'audioStart', 'audioEnd', 'text', 'fileId', 'speaker', 'labeled', 'correct', 'wrong', 'play'];
  dataSource = new MatTableDataSource<TextAudio>();
  waveSurfer: WaveSurfer = null;
  isEdit = false;
  paused = false;
  toggleVolume = false;
  text = '';

  ngOnInit() {
    this.apiService.getTextAudios().subscribe(textAudio => {
      this.dataSource = new MatTableDataSource<TextAudio>(textAudio);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, () => {
    }, () => {
      this.dataSource.filterPredicate = (data, filter: string): boolean => {
        return data.labeled.toString().toLowerCase().includes(filter);
      };
    });
  }

  ngOnChanges(): void {
    if (this.vale !== '') {
      this.filterPie(this.vale);
    }
  }

  editElement(textAudio: TextAudio): void {
    this.generateWaveform(textAudio);
    this.isEdit = true;
  }

  generateWaveform(textAudio: TextAudio): void {
    Promise.resolve(null).then(() => {
      this.waveSurfer = WaveSurfer.create({
        container: '#waveform',
        backend: 'MediaElement',
        waveColor: 'lightblue',
        progressColor: 'blue',
        partialRender: false,
        normalize: false,
        responsive: true,
        plugins: [
          TimelinePlugin.create({
            container: '#wave-timeline'
          }),
          CursorPlugin.create({
            showTime: true,
            opacity: 1
          }),
          RegionsPlugin.create({
            regions: []
          })
        ]
      });
      this.loadAudioBlob(textAudio.fileId);
      this.waveSurfer.on('ready', () => {
        this.isEdit = true;
        this.waveSurfer.clearRegions();
        this.waveSurfer.addRegion({
          start: textAudio.audioStart,
          end: textAudio.audioEnd,
          resize: true,
          color: 'hsla(200, 50%, 70%, 0.4)'
        });
        this.setViewToRegion(textAudio);
        this.text = textAudio.text;
      });
    });
  }

  play(): void {
    this.paused = true;
    this.waveSurfer.play();
  }

  setViewToRegion(textAudio: TextAudio): void {
    this.waveSurfer.zoom(50);
    const diff = textAudio.audioStart - textAudio.audioEnd;
    const centre = textAudio.audioStart + (diff / 2);
    const fin = (centre / this.waveSurfer.getDuration());
    this.waveSurfer.seekAndCenter(fin);
  }

  pause(): void {
    this.paused = false;
    this.waveSurfer.pause();
  }

  setVolume(volume: any): void {
    this.waveSurfer.setVolume(volume.value / 100);
  }

  loadAudioBlob(fileId: number): void {
    this.apiService.getAudioFile(fileId).subscribe(resp => {
      this.waveSurfer.load(URL.createObjectURL(resp));
    });
  }

  cancelEdit(): void {
    this.isEdit = false;
    this.waveSurfer.destroy();
  }

  filterPie(input: string): void {
    input = input.trim();
    input = input.toLowerCase();
    this.dataSource.filter = input;
  }
}
