import {Component, OnInit} from '@angular/core';
import {ExportToCsv} from 'export-to-csv';
import {ApiService} from '../../../services/api.service';
import {Sums} from '../../../models/Sums';
import {UserLabeledData} from '../../../models/UserLabeledData';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  constructor(
    private apiService: ApiService
  ) {
  }

  inputData: Array<Sums> = [];
  userInputData: Array<UserLabeledData> = [];

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
    this.apiService.getLabeledSums().subscribe(l => this.inputData = l);
    this.apiService.getTopFiveUsersLabeledCount().subscribe(l => this.userInputData = l);
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
