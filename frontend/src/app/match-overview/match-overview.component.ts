import {Component, Input, OnInit} from '@angular/core';
import {TextAudioMatch} from '../models/textAudioMatch';
import {ApiService} from '../services/api.service';
import {TextAudioIndex} from '../models/textAudioIndex';

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

  @Input() textAudioMatch: TextAudioMatch;
  textAudioIndexArray: Array<TextAudioIndex> = [];

  ngOnInit() {
    this.apiService.getTextAudioIndex().subscribe(i => {
      this.textAudioIndexArray = i;
    });
  }

}
