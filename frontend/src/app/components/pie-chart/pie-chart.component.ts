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
    this.apiService.getLabeledSums().subscribe(l => l.forEach(s => this.single = [{name: 'Not-Labeled', value: s.nonLabeled}, {name: 'Labeled', value: s.correct + s.wrong + s.skipped}]));
  }
}
