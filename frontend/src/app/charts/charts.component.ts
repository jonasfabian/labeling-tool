import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {

  constructor(
    private apiService: ApiService
  ) {
  }

  showLegend = true;

  colorScheme = {
    domain: ['blue', 'steelblue']
  };

  single = [];

  ngOnInit() {
    let labeled = 0;
    let nLabeled = 0;
    this.apiService.getTextAudioIndexes().subscribe(a => a.forEach(l => {
      if (l.labeled === 1) {
        labeled++;
        this.single = [{name: 'Labeled', value: labeled}, {name: 'Not Labeled', value: nLabeled}];
      } else {
        nLabeled++;
        this.single = [{name: 'Labeled', value: labeled}, {name: 'Not Labeled', value: nLabeled}];
      }
    }));
  }
}
