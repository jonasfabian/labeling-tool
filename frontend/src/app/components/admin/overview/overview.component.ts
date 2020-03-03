import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {OccurrenceMode} from '../../check/check/check.component';
import {UserGroupService} from '../../../services/user-group.service';

export interface OverviewOccurrence {
  text: string;
  correct: number;
  wrong: number;
  id: number;
}

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  // TODO simplify component
  @ViewChild('textAreaText') textAreaText: ElementRef<HTMLTextAreaElement>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  showTextAudio = true;
  // TODO change dao
  dataSource = new MatTableDataSource<OverviewOccurrence | { id: number, text: string, username: string, time: string }>();
  columns = ['text', 'correct', 'wrong', 'options'];
  private selectedTextAudioDto: OverviewOccurrence;
  // todo switch -> probably only show recordings for others.
  private mode: OccurrenceMode = OccurrenceMode.TEXT_AUDIO;

  constructor(private det: ChangeDetectorRef, private httpClient: HttpClient, private userGroupService: UserGroupService) {
  }

  ngOnInit() {
    // TODO not sure we even need a datasource instead of an array?
    this.getTextAudios().subscribe(textAudio => {
      this.dataSource = new MatTableDataSource<OverviewOccurrence>(textAudio);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  selectElement(textAudio: OverviewOccurrence) {
    this.selectedTextAudioDto = textAudio;
  }

  toggleChangeView(): void {
    this.showTextAudio = !this.showTextAudio;
    // TODO simplify like check component
    this.getTextAudios().subscribe(textAudio => {
      this.dataSource = new MatTableDataSource<OverviewOccurrence>(textAudio);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  edit(element: any) {
  }

  play(element: any) {
  }

  // TODO only return the top 100 audio filtered by label status
  private getTextAudios(): Observable<Array<OverviewOccurrence>> {
    return this.httpClient.get<Array<OverviewOccurrence>>(`${environment.url}user_group/${this.userGroupService.userGroupId}/admin/overview_occurrence?mode=${(this.mode)}`);
  }
}
