import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
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
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  showTextAudio = true;
  dataSource = new MatTableDataSource<OverviewOccurrence | { id: number, text: string, username: string, time: string }>();
  columns = ['text', 'correct', 'wrong', 'options'];
  private selectedTextAudioDto: OverviewOccurrence;

  constructor(private det: ChangeDetectorRef, private httpClient: HttpClient, private userGroupService: UserGroupService) {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<OverviewOccurrence>([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.reload();
  }

  selectElement(textAudio: OverviewOccurrence) {
    this.selectedTextAudioDto = textAudio;
  }

  toggleChangeView(): void {
    this.showTextAudio = !this.showTextAudio;
    this.reload();
  }

  reload() {
    this.getTextAudios().subscribe(textAudio => {
      this.dataSource.data = textAudio;
    });
  }

  edit(element: any) {
    // TODO implement logic
  }

  play(element: any) {
    // TODO implement logic
  }

  private getTextAudios(): Observable<Array<OverviewOccurrence>> {
    const mode = this.showTextAudio ? OccurrenceMode.TEXT_AUDIO : OccurrenceMode.RECORDING;
    return this.httpClient.get<Array<OverviewOccurrence>>(`${environment.url}user_group/${this.userGroupService.userGroupId}/admin/overview_occurrence?mode=${(mode)}`);
  }
}
