import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TicTacToeComponent} from './tic-tac-toe.component';

@Component({
  selector: 'app-win-dialog',
  templateUrl: './win-dialog.component.html',
  styleUrls: []
})
export class WinDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TicTacToeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {
  }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close();
  }
}
