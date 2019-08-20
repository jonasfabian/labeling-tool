import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-session-overview',
  templateUrl: './session-overview.component.html',
  styleUrls: ['./session-overview.component.scss']
})

export class SessionOverviewComponent implements OnInit {

  constructor(
  ) {
  }

  showLegend = true;
  single = [];
  colorScheme = {
    domain: ['#3f51b5', '#7482cf', 'blue', 'darkblue']
  };

  ngOnInit() {
    const sessionData = JSON.parse(sessionStorage.getItem('checkData'))[0];
    this.single = [
      {name: 'Correct', value: sessionData.correct},
      {name: 'Wrong', value: sessionData.wrong},
      {name: 'Skipped', value: sessionData.skipped}
    ];
  }
}
