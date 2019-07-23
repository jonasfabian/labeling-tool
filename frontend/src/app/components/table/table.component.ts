import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {TextAudioIndexWithText} from '../../models/textAudioIndexWithText';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

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

  filter(input: string): void {
    input = input.trim();
    input = input.toLowerCase();
    this.dataSource.filter = input;
  }

}
