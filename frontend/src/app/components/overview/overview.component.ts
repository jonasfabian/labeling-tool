import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {TextAudioDto} from '../../models/text-audio-dto';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import {ExportToCsv} from 'export-to-csv';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  @ViewChild('textAreaText') textAreaText: ElementRef<HTMLTextAreaElement>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  showAll = true;
  dataSource = new MatTableDataSource<TextAudioDto | { id: number, text: string, username: string, time: string }>();
  allColumns = ['text', 'correct', 'wrong'];
  recordingColumns = ['text', 'time', 'username'];
  waveSurfer: WaveSurfer = null;
  isEditText = false;
  // TODO not sure this make sense
  dummyTextAudio = new TextAudioDto(0, 0, 0, '');
  dummy = new TextAudioDto(0, 0, 0, '');
  dummyRecording: TextAudioDto;
  currentFileId = -1;
  text = '';
  isPlaying = false;
  waveSurferIsReady = false;
  data = [];
  csvExporter = new ExportToCsv({
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true
  });

  constructor(private apiService: ApiService, private det: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.apiService.getTextAudios().subscribe(textAudio => {
      this.dataSource = new MatTableDataSource<TextAudioDto>(textAudio);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  previewElement(textAudio: TextAudioDto) {
    this.isEditText = false;
    if (this.waveSurfer !== null) {
      this.waveSurfer.pause();
      this.isPlaying = false;
    }
    if (textAudio.audioStart !== undefined) {
      this.dummyTextAudio = textAudio;
    } else {
      this.dummyRecording = textAudio;
    }
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
        this.dataSource = new MatTableDataSource<TextAudioDto>(textAudio);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
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
      this.apiService.updateTextAudio(this.dummyTextAudio).subscribe();
      this.addRegion(this.dummyTextAudio, false);
    } else {
      this.dummyRecording.text = this.text = this.textAreaText.nativeElement.value;
      this.apiService.updateRecording(this.dummyRecording.id, this.dummyRecording.text).subscribe();
    }
    this.isEditText = !this.isEditText;
  }

  // TODO not sure it makes any sense to export this data as csv ?
  generateTable() {
    this.apiService.getTextAudios().subscribe(textAudio => {
      textAudio.forEach(l => {
        this.data.push({
          id: l.id,
          audioStart: l.audioStart,
          audioEnd: l.audioEnd,
          text: l.text,
        });
      });
      this.csvExporter.generateCsv(this.data);
    });
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

  // TODO refactor so we only need to load the big one in case the user wants to edit else just load the small one -> see check component
  private loadAudioBlob(fileId: number): void {
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
    this.waveSurfer.on('finish', () => this.isPlaying = false);
  }
}
