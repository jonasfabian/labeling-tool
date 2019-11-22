import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-session-overview',
  templateUrl: './session-overview.component.html',
  styleUrls: ['./session-overview.component.scss']
})

export class SessionOverviewComponent implements OnInit {

  showLegend = true;
  single = [];
  noDataAvailable = true;
  colorScheme = {
    domain: ['#3f51b5', '#7482cf', 'blue', 'darkblue']
  };

  constructor(
    public dialogRef: MatDialogRef<SessionOverviewComponent>
  ) {
  }

  ngOnInit() {
    const sessionData = JSON.parse(sessionStorage.getItem('checkData'))[0];
    if (sessionData.correct === 0 && sessionData.wrong === 0 && sessionData.skipped === 0) {
      this.noDataAvailable = true;
    } else {
      this.noDataAvailable = false;
    }
    this.single = [
      {name: 'Correct', value: sessionData.correct},
      {name: 'Wrong', value: sessionData.wrong},
      {name: 'Skipped', value: sessionData.skipped}
    ];
  }

  close(): void {
    this.dialogRef.close();
  }
}
