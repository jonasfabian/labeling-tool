import {Component, OnInit} from '@angular/core';
import {ExportToCsv} from 'export-to-csv';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-match-overview',
  templateUrl: './match-overview.component.html',
  styleUrls: ['./match-overview.component.scss']
})
export class MatchOverviewComponent implements OnInit {

  constructor(
    private apiService: ApiService
  ) {
  }

  str = '';
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
  data = [];

  ngOnInit() {
  }

  getVale(input: string): void {
    this.str = input;
  }

  generateTable(): void {
    this.apiService.getTextAudioIndexes().subscribe(te => te.forEach(l => {
        this.data.push({
          id: l.id,
          samplingRate: l.samplingRate,
          textStartPos: l.textStartPos,
          textEndPos: l.textEndPos,
          audioStartPos: l.audioStartPos,
          audioEndPos: l.audioEndPos,
          speakerKey: l.speakerKey,
          labeled: l.labeled,
          correct: l.correct,
          wrong: l.wrong,
          transcriptFileId: l.transcriptFileId
        });
      }), () => {}
      , () => this.csvExporter.generateCsv(this.data));
  }
}
