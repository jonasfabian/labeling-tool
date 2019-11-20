import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Sums} from '../../../../models/Sums';

@Component({
  selector: 'app-horizontal-normalized-bar-chart',
  templateUrl: './horizontal-normalized-bar-chart.component.html',
  styleUrls: ['./horizontal-normalized-bar-chart.component.scss']
})
export class HorizontalNormalizedBarChartComponent implements OnInit, OnChanges {

  @Input() inputData: Sums;
  single = [];
  colorScheme = {domain: ['#3f51b5', '#7482cf', 'blue', 'darkblue']};

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(): void {
    const singleData = [];
    singleData.push({
      name: '', series: [
        {name: 'Checked', value: this.inputData.wrong + this.inputData.correct},
        {name: 'Not-Checked', value: this.inputData.total - (this.inputData.wrong + this.inputData.correct)}
      ]
    });
    this.single = singleData;
  }
}

