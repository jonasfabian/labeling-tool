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
  ) {
  }

  showLegend = true;
  single = [];
  view = [];
  colorScheme = {
    domain: ['#3f51b5', '#7482cf', 'blue', 'darkblue']
  };

  ngOnInit() {
    this.view = [innerWidth / 3.5, innerHeight / 6];
    this.apiService.getLabeledSums().subscribe(l => l.forEach(s => {
      this.single = [
        {name: 'Not-Labeled', value: s.nonLabeled},
        {name: 'Correct', value: s.correct},
        {name: 'Wrong', value: s.wrong},
        {name: 'Skipped', value: s.skipped}];
    }));
  }

  onResize(event) {
    this.view = [event.target.innerWidth / 3.5, event.target.innerHeight / 6];
  }
}
