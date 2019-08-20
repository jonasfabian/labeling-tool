import {Component, OnInit} from '@angular/core';
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
    this.apiService.getLabeledSums().subscribe(l => l.forEach(s => {
      this.single = [
        {name: 'Not-Labeled', value: s.nonLabeled},
        {name: 'Correct', value: s.correct},
        {name: 'Wrong', value: s.wrong},
        {name: 'Skipped', value: s.skipped}];
    }));
  }
}
