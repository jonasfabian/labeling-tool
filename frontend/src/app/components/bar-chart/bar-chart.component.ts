import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

  constructor(
    private apiService: ApiService
  ) { }

  showLegend = true;
  single = [];
  colorScheme = {
    domain: ['#3f51b5', '#7482cf', 'blue', 'darkblue']
  };

  ngOnInit() {
    let nLabeled = 0;
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    this.apiService.getTextAudioIndexes().subscribe(a => a.forEach(l => {
      if (l.labeled === 0) {
        nLabeled++;
      } else if (l.labeled === 1) {
        correct++;
      } else if (l.labeled === 2) {
        wrong++;
      } else if (l.labeled === 3) {
        skipped++;

      }
    }), () => {}, () => this.single = [{name: 'Not-Labeled', value: nLabeled}, {name: 'Correct', value: correct}, {name: 'Wrong', value: wrong}, {name: 'Skipped', value: skipped}]);
  }

}
