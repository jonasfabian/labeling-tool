import {Component, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {WinDialogComponent} from './win-dialog.component';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss']
})
export class TicTacToeComponent implements OnInit {

  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
  }

  currentTurn = 'x';
  win = false;
  grid: Array<Array<Tile>> = [
    [new Tile(0, ''), new Tile(1, ''), new Tile(2, '')],
    [new Tile(3, ''), new Tile(4, ''), new Tile(5, '')],
    [new Tile(6, ''), new Tile(7, ''), new Tile(8, '')]
  ];

  ngOnInit() {
  }

  changeTurn(): void {
    if (this.currentTurn === 'x') {
      this.currentTurn = 'o';
    } else {
      this.currentTurn = 'x';
    }
  }

  changeValue(column: Tile): void {
    if (column.value === '') {
      this.grid.forEach(l => l.map(r => {
        if (r.id === column.id) {
          r.value = this.currentTurn;
          this.checkWin();
          this.changeTurn();
        }
      }));
    } else {
      this.dialog.open(WinDialogComponent, {
        data: 'This tile already has a value',
        width: '500px'
      });
    }
  }

  openWinDialog() {
    this.dialog.open(WinDialogComponent, {
      data: 'You Won',
      width: '250px'
    });
  }

  checkWin(): void {
    if ((this.grid[0][0].value === 'x' && this.grid[0][1].value === 'x' && this.grid[0][2].value === 'x') || (this.grid[0][0].value === 'o' && this.grid[0][1].value === 'o' && this.grid[0][2].value === 'o')) {
      this.openWinDialog();
      this.win = true;
    } else if ((this.grid[1][0].value === 'x' && this.grid[1][1].value === 'x' && this.grid[1][2].value === 'x') || (this.grid[1][0].value === 'o' && this.grid[1][1].value === 'o' && this.grid[1][2].value === 'o')) {
      this.openWinDialog();
      this.win = true;
    } else if ((this.grid[2][0].value === 'x' && this.grid[2][1].value === 'x' && this.grid[2][2].value === 'x') || (this.grid[2][0].value === 'o' && this.grid[2][1].value === 'o' && this.grid[2][2].value === 'o')) {
      this.openWinDialog();
      this.win = true;
    } else if ((this.grid[0][0].value === 'x' && this.grid[1][0].value === 'x' && this.grid[2][0].value === 'x') || (this.grid[0][0].value === 'o' && this.grid[1][0].value === 'o' && this.grid[2][0].value === 'o')) {
      this.openWinDialog();
      this.win = true;
    } else if ((this.grid[0][1].value === 'x' && this.grid[1][1].value === 'x' && this.grid[2][1].value === 'x') || (this.grid[0][1].value === 'o' && this.grid[1][1].value === 'o' && this.grid[2][1].value === 'o')) {
      this.openWinDialog();
      this.win = true;
    } else if ((this.grid[0][2].value === 'x' && this.grid[1][2].value === 'x' && this.grid[2][2].value === 'x') || (this.grid[0][2].value === 'o' && this.grid[1][2].value === 'o' && this.grid[2][2].value === 'o')) {
      this.openWinDialog();
      this.win = true;
    } else if ((this.grid[0][0].value === 'x' && this.grid[1][1].value === 'x' && this.grid[2][2].value === 'x') || (this.grid[0][0].value === 'o' && this.grid[1][1].value === 'o' && this.grid[2][2].value === 'o')) {
      this.openWinDialog();
      this.win = true;
    } else if ((this.grid[0][2].value === 'x' && this.grid[1][1].value === 'x' && this.grid[2][0].value === 'x') || (this.grid[0][2].value === 'o' && this.grid[1][1].value === 'o' && this.grid[2][0].value === 'o')) {
      this.openWinDialog();
      this.win = true;
    }
  }

  clear(): void {
    this.win = false;
    this.grid = [
      [new Tile(0, ''), new Tile(1, ''), new Tile(2, '')],
      [new Tile(3, ''), new Tile(4, ''), new Tile(5, '')],
      [new Tile(6, ''), new Tile(7, ''), new Tile(8, '')]
    ];
    this.snackBar.open('Cleared Grid', '', {duration: 3000});
  }
}

export class Tile {
  id: number;
  value: string;

  constructor(id: number, value: string) {
    this.id = id;
    this.value = value;
  }
}
