import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Sums} from '../../../../models/Sums';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit, OnChanges {

  constructor() {
  }

  @Input() inputData: Array<Sums>;
  single = [];
  view = [];
  colorScheme = {domain: ['#3f51b5', '#7482cf', 'blue', 'darkblue']};

  ngOnInit() {
    this.view = [innerWidth / 4, innerHeight / 6];
  }

  ngOnChanges() {
    const test = [];
    if (this.inputData.length !== 0) {
      this.inputData.forEach(l => {
        test.push({name: 'Correct', value: l.correct});
        test.push({name: 'Wrong', value: l.wrong});
      });
      this.single = test;
    }
  }

  onResize(event) {
    this.view = [event.target.innerWidth / 4, event.target.innerHeight / 6];
  }
}