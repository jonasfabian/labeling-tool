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

  @Input() inputData: Sums;
  single = [];
  view = [];
  colorScheme = {domain: ['#3f51b5', '#7482cf', 'blue', 'darkblue']};

  ngOnInit() {
    this.view = [innerWidth / 4, innerHeight / 6];
  }

  ngOnChanges() {
    if (this.inputData.total !== 0) {
      const singleData = [];
      singleData.push({name: 'Correct', value: this.inputData.correct});
      singleData.push({name: 'Wrong', value: this.inputData.wrong});
      this.single = singleData;
    }
  }

  onResize(event) {
    this.view = [event.target.innerWidth / 4, event.target.innerHeight / 6];
  }
}
