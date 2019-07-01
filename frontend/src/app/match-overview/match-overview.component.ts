import {Component, Input, OnInit} from '@angular/core';
import {TextAudioMatch} from '../models/textAudioMatch';

@Component({
  selector: 'app-match-overview',
  templateUrl: './match-overview.component.html',
  styleUrls: ['./match-overview.component.scss']
})
export class MatchOverviewComponent implements OnInit {

  constructor() { }

  @Input() textAudioMatch: TextAudioMatch;

  ngOnInit() {
  }

}
