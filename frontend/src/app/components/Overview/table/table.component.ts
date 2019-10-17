import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ApiService} from '../../../services/api.service';
import {TextAudio} from '../../../models/TextAudio';

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

  displayedColumns = ['id', 'audioStart', 'audioEnd', 'text', 'fileId', 'speaker', 'labeled', 'correct', 'wrong'];
  dataSource = new MatTableDataSource<TextAudio>();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() vale: string;

  ngOnInit() {
    this.apiService.getTextAudios().subscribe(textAudio => {
      this.dataSource = new MatTableDataSource<TextAudio>(textAudio);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, () => {}, () => {
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

  filterPie(input: string): void {
    input = input.trim();
    input = input.toLowerCase();
    this.dataSource.filter = input;
  }
}
