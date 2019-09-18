import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ApiService} from '../../../services/api.service';
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

  @Output() vale = new EventEmitter<string>();
  @ViewChild('pie', {static: false}) pie: BaseChartComponent;

  single = [];
  view = [];
  colorScheme = {
    domain: ['#3f51b5', '#7482cf']
  };

  ngOnInit() {
    this.view = [innerWidth / 4, innerHeight / 5];
    this.apiService.getLabeledSums().subscribe(l => l.forEach(s => this.single = [
      {name: 'Labeled', value: s.correct + s.wrong}
    ]));
  }

  filterLabeled(event: any): void {
    if (event.name === 'Labeled') {
      this.vale.emit('1');
    } else if (event.name === 'Not-Labeled') {
      this.vale.emit('0');
    }
  }

  onResize(event) {
    this.view = [event.target.innerWidth / 4, event.target.innerHeight / 5];
  }
}
