import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {BaseChartComponent} from '@swimlane/ngx-charts';

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
  @Output() vale = new EventEmitter<string>();
  @ViewChild('pie', {static: false}) pie: BaseChartComponent;

  colorScheme = {
    domain: ['#3f51b5', '#7482cf', 'blue', 'darkblue']
  };

  single = [];

  ngOnInit() {
    this.apiService.getLabeledSums().subscribe(l => l.forEach(s => this.single = [{name: 'Not-Labeled', value: s.nonLabeled}, {name: 'Labeled', value: s.correct + s.wrong + s.skipped}]));
  }

  logThis(event: any): void {
    if (event.name === 'Labeled') {
      this.vale.emit('true');
    } else if (event.name === 'Not-Labeled') {
      this.vale.emit('false');
    }
  }
}
