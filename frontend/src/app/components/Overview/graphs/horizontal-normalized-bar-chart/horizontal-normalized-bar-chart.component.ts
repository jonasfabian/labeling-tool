import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Sums} from '../../../../models/Sums';

@Component({
  selector: 'app-horizontal-normalized-bar-chart',
  templateUrl: './horizontal-normalized-bar-chart.component.html',
  styleUrls: ['./horizontal-normalized-bar-chart.component.scss']
})
export class HorizontalNormalizedBarChartComponent implements OnInit, OnChanges {

  constructor() {
  }

  @Input() inputData: Array<Sums>;
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
        test.push({
          name: '', series: [
            {name: 'Checked', value: l.correct + l.wrong},
            {name: 'Not-Checked', value: l.totalTextAudioIndexes - (l.correct + l.wrong)}
          ]
        });
      });
      this.single = test;
    }
  }

  onResize(event) {
    this.view = [event.target.innerWidth / 4, event.target.innerHeight / 6];
  }
}
