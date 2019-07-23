import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-match-overview',
  templateUrl: './match-overview.component.html',
  styleUrls: ['./match-overview.component.scss']
})
export class MatchOverviewComponent implements OnInit {

  constructor() {
  }

  str = '';

  ngOnInit() {
  }

  getVale(input: string): void {
    this.str = input;
  }
}
