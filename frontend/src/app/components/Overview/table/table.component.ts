import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ApiService} from '../../../services/api.service';
import {TextAudio} from '../../../models/TextAudio';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import {DomSanitizer} from '@angular/platform-browser';
import {ExportToCsv} from 'export-to-csv';
import {AudioSnippet} from '../../../models/AudioSnippet';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private ref: ChangeDetectorRef
  ) {
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('textAreaText', {static: false}) textAreaText: ElementRef<HTMLTextAreaElement>;
  @Input() vale: string;
  @Output() editAudio = new EventEmitter<boolean>();
  @Output() textAudio = new EventEmitter<TextAudio>();
  displayedColumns = ['id', 'audioStart', 'audioEnd', 'text', 'fileId', 'speaker', 'labeled', 'correct', 'wrong'];
  dataSource = new MatTableDataSource<TextAudio>();
  waveSurfer: WaveSurfer = null;
  isEditing = false;
  isEditText = false;
  wavesurferIsReady = false;
  dummyTextAudio = new TextAudio(0, 0, 0, '', 0, '', 0, 0, 0);
  paused = false;
  toggleVolume = false;
  currentFileId = -1;
  text = '';
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

  previewElement(textAudio: TextAudio): void {
    this.isEditText = false;
    this.dummyTextAudio = textAudio;
    this.isEditing = true;
    this.wavesurferIsReady = false;
    this.generateWaveform(textAudio);
  }

  generateWaveform(textAudio: TextAudio): void {
    Promise.resolve(null).then(() => {
      if (this.waveSurfer === null) {
        this.createWaveform();
        this.currentFileId = textAudio.fileId;
        this.loadAudioBlob(textAudio.fileId);
        this.waveSurfer.on('ready', () => {
          this.addRegion(textAudio);
          this.setViewToRegion(textAudio);
          this.text = textAudio.text;
        });
        this.waveSurfer.on('waveform-ready', () => {
          this.wavesurferIsReady = true;
          this.ref.detectChanges();
        });
      } else {
        this.pause();
        if (this.currentFileId !== textAudio.fileId) {
          this.loadAudioBlob(textAudio.fileId);
          this.waveSurfer.on('ready', () => {
            this.addRegion(textAudio);
            this.setViewToRegion(textAudio);
            this.text = textAudio.text;
          });
          this.waveSurfer.on('waveform-ready', () => {
            this.wavesurferIsReady = true;
            this.ref.detectChanges();
          });
        } else {
          this.addRegion(textAudio);
          this.setViewToRegion(textAudio);
          this.text = textAudio.text;
          this.wavesurferIsReady = true;
          this.ref.detectChanges();
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
      partialRender: false,
      normalize: false,
      responsive: true,
      plugins: [
        TimelinePlugin.create({
          container: '#wave-timeline'
        }),
        RegionsPlugin.create({
          regions: []
        })
      ]
    });
  }

  addRegion(textAudio: TextAudio): void {
    this.waveSurfer.clearRegions();
    const region = this.waveSurfer.addRegion({
      start: textAudio.audioStart,
      end: textAudio.audioEnd,
      resize: true,
      color: 'hsla(200, 50%, 70%, 0.4)'
    });
    region.on('update-end', () => {
      this.dummyTextAudio.audioStart = region.start;
      this.dummyTextAudio.audioEnd = region.end;
      console.log(this.dummyTextAudio);
    });
  }

  play(): void {
    this.paused = true;
    this.waveSurfer.play();
  }

  pause(): void {
    this.paused = false;
    this.waveSurfer.pause();
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
    this.apiService.getAudioFile(fileId).subscribe(resp => {
      this.waveSurfer.load(URL.createObjectURL(resp));
    });
  }

  cancelEdit(): void {
    this.pause();
    this.isEditing = false;
    this.waveSurfer.destroy();
    this.waveSurfer = null;
  }

  changeText(): void {
    this.dummyTextAudio.text = this.textAreaText.nativeElement.value;
    this.apiService.updateTextAudio(this.dummyTextAudio).subscribe();
    this.isEditText = !this.isEditText;
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
}
