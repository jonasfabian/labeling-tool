import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../services/api.service';
import {TextAudioIndex} from '../models/textAudioIndex';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

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

  @Input() textAudioIndexArray: Array<TextAudioIndex> = [];
  displayedColumns = ['id', 'samplingRate', 'textStartPos', 'textEndPos', 'audioStartPos', 'audioEndPos', 'speakerKey', 'labeled'];
  dataSource = new MatTableDataSource<TextAudioIndex>();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.apiService.getTextAudioIndex().subscribe(i => {
      this.textAudioIndexArray = i;
      this.dataSource = new MatTableDataSource<TextAudioIndex>(i);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}
