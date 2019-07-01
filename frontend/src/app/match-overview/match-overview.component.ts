import {Component, Input, OnInit} from '@angular/core';
import {TextAudioMatch} from '../models/textAudioMatch';
import {ApiService} from '../services/api.service';
import {Match} from '../models/match';

@Component({
  selector: 'app-match-overview',
  templateUrl: './match-overview.component.html',
  styleUrls: ['./match-overview.component.scss']
})
export class MatchOverviewComponent implements OnInit {

  constructor(
    private apiService: ApiService
  ) { }

  @Input() textAudioMatch: TextAudioMatch;
  matchesArray: Array<Match> = [];

  ngOnInit() {
    this.apiService.getMatches().subscribe(m => {
      this.matchesArray = m;
    });
  }

}
