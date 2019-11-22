import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services/api.service';

@Component({
  selector: 'app-recordings-overview',
  templateUrl: './recordings-overview.component.html',
  styleUrls: ['./recordings-overview.component.scss']
})
export class RecordingsOverviewComponent implements OnInit {

  constructor(
    private apiService: ApiService
  ) {
  }

  recordings = [];

  ngOnInit() {
    this.apiService.getAllRecordingData().subscribe(recordings => {
      this.recordings = recordings;
    });
  }

}
