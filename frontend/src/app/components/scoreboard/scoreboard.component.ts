import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit {

  constructor(
    private apiService: ApiService
  ) { }

  displayedColumns: string[] = ['username', 'score'];
  dataSource = new MatTableDataSource<{username: string, score: number}>();

  ngOnInit() {
    this.apiService.getAllScores().subscribe(scores => {
      this.dataSource = scores;
    });
  }

}
