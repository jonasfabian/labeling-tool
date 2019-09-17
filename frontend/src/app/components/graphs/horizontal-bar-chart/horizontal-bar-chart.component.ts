import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';

@Component({
  selector: 'app-horizontal-bar-chart',
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrls: ['./horizontal-bar-chart.component.scss']
})
export class HorizontalBarChartComponent implements OnInit {

  constructor(
    private apiService: ApiService
  ) {
  }

  single = [];
  view = [];
  colorScheme = {
    domain: ['#3f51b5', '#7482cf', 'blue', 'darkblue']
  };

  ngOnInit() {
    const test = [];
    this.view = [innerWidth / 4, innerHeight / 6];
    this.apiService.getTopFiveUsersLabeledCount().subscribe(l => l.forEach(s => {
          test.push({name: s.username, value: s.labelCount});
      }
    ), () => {}, () => this.single = test);
  }

  onResize(event) {
    this.view = [event.target.innerWidth / 4, event.target.innerHeight / 6];
  }
}
