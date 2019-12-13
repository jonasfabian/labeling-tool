import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss']
})

export class SnakeComponent implements OnInit {
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;

  constructor() {
  }

  cellSize = 20;
  yCoord = 0;
  xCoord = 0;
  currentDirection = '';

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.currentDirection = 'left';
    } else if (event.key === 'ArrowRight') {
      this.currentDirection = 'right';
    } else if (event.key === 'ArrowUp') {
      this.currentDirection = 'up';
    } else if (event.key === 'ArrowDown') {
      this.currentDirection = 'down';
    }
  }

  drawCell(coords: Point, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = 'white';
    const x = coords.x * this.cellSize;
    const y = coords.y * this.cellSize;
    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
    this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
  }

  play(): void {
    const cellArray: Array<Point> = [];
    const maxLength = 10;
    setInterval(() => {
      if (cellArray.length === 0) {
        const point = new Point((this.ctx.canvas.width / 2) / this.cellSize, (this.ctx.canvas.height / 2) / this.cellSize);
        this.drawCell(point, 'blue');
        cellArray.push(point);
      } else {
        const headX = cellArray[cellArray.length - 1].x * this.cellSize;
        const headY = cellArray[cellArray.length - 1].y * this.cellSize;
        if (headX < this.ctx.canvas.width && headX >= 0 && headY < this.ctx.canvas.height && headY >= 0) {
          cellArray.forEach(cell => {
            this.drawCell(cell, 'blue');
          });
          if (this.currentDirection === 'left') {
            this.xCoord--;
          } else if (this.currentDirection === 'right') {
            this.xCoord++;
          } else if (this.currentDirection === 'up') {
            this.yCoord--;
          } else if (this.currentDirection === 'down') {
            this.yCoord++;
          }
          cellArray.push(new Point(this.xCoord, this.yCoord));
          if (cellArray.length > maxLength) {
            this.drawCell(cellArray[0], 'white');
            cellArray.splice(0, 1);
          }
        }
      }
    }, 200);
  }

  clear(): void {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }
}

export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
