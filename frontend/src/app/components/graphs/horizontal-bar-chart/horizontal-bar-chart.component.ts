import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {UserLabeledData} from '../../../models/UserLabeledData';

@Component({
  selector: 'app-horizontal-bar-chart',
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrls: ['./horizontal-bar-chart.component.scss']
})
export class HorizontalBarChartComponent implements OnInit, OnChanges {

  constructor() {
  }

  @Input() inputData: Array<UserLabeledData>;
  single = [];
  view = [];
  colorScheme = {domain: ['#3f51b5', '#7482cf', 'blue', 'darkblue']};

  ngOnInit() {
    this.view = [innerWidth / 4, innerHeight / 6];
  }

  ngOnChanges(): void {
    const test = [];
    if (this.inputData.length !== 0) {
      this.inputData.forEach(l => {
        test.push({name: l.username, value: l.labelCount});
      });
      this.single = test;
    }
  }

  onResize(event) {
    this.view = [event.target.innerWidth / 4, event.target.innerHeight / 6];
  }
}
