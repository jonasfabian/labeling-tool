import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {UserLabeledData} from '../../../../models/UserLabeledData';

@Component({
  selector: 'app-horizontal-bar-chart',
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrls: ['./horizontal-bar-chart.component.scss']
})
export class HorizontalBarChartComponent implements OnInit, OnChanges {

  @Input() inputData: Array<UserLabeledData>;
  single = [];
  colorScheme = {domain: ['#3f51b5', '#7482cf', 'blue', 'darkblue']};

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(): void {
    const singleData = [];
    if (this.inputData.length !== 0) {
      this.inputData.forEach(l => {
        singleData.push({name: l.username, value: l.count});
      });
      this.single = singleData;
    }
  }
}
