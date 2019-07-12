import {Component, OnChanges, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../services/api.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {TextAudioIndexWithText} from '../models/textAudioIndexWithText';

@Component({
  selector: 'app-match-overview',
  templateUrl: './match-overview.component.html',
  styleUrls: ['./match-overview.component.scss']
})
export class MatchOverviewComponent implements OnInit, OnChanges {

  constructor(
    private apiService: ApiService
  ) {
  }

  displayedColumns = ['id', 'samplingRate', 'textStartPos', 'textEndPos', 'audioStartPos', 'audioEndPos', 'speakerKey', 'labeled', 'transcriptFileId'];
  dataSource = new MatTableDataSource<TextAudioIndexWithText>();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.apiService.getTextAudioIndexes().subscribe(i => {
      this.dataSource = new MatTableDataSource<TextAudioIndexWithText>(i);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnChanges(): void {
  }
}
