import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';

@Component({
  selector: 'app-number-cards',
  templateUrl: './number-cards.component.html',
  styleUrls: ['./number-cards.component.scss']
})
export class NumberCardsComponent implements OnInit {

  constructor(
    private apiService: ApiService
  ) {
  }

  single = [];
  view = [];
  colorScheme = {
    domain: ['#3f51b5', '#7482cf', 'blue', 'darkblue']
  };

  ngOnInit() {
    this.view = [innerWidth / 4, innerHeight / 6];
    this.apiService.getLabeledSums().subscribe(l => l.forEach(s => {
      this.single = [
        {name: 'Not-Labeled', value: s.nonLabeled},
        {name: 'Correct', value: s.correct},
        {name: 'Wrong', value: s.wrong},
        {name: 'Skipped', value: s.skipped}];
    }));
  }

  onResize(event) {
    this.view = [event.target.innerWidth / 4, event.target.innerHeight / 6];
  }
}
