import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  constructor(
    private apiService: ApiService
  ) {
  }

  showLegend = true;

  colorScheme = {
    domain: ['#3f51b5', '#7482cf', 'blue', 'darkblue']
  };

  single = [];

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
