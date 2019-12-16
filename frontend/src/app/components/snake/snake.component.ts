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

  cellSize = 40;
  yCoord = 0;
  xCoord = 0;
  currentDirection = '';
  cellArray: Array<Point> = [];
  randomItemArray: Array<Point> = [];
  maxLength = 3;
  interval: any;

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  @HostListener('window:keydown', ['$event'])
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
    const randomItem = this.generateRandomItem();
    if (this.randomItemArray.length === 0) {
      this.drawCell(randomItem, 'green');
      this.randomItemArray.push(randomItem);
    } else {
      this.randomItemArray.forEach(rItem => {
        this.drawCell(rItem, 'green');
      });
    }
    this.createInterval();
  }

  createInterval(): void {
    this.interval = setInterval(() => {
      if (this.cellArray.length === 0) {
        const firstCell = this.generateRandomItem();
        this.drawCell(firstCell, 'blue');
        this.cellArray.push(firstCell);
      } else {
        const headX = this.cellArray[this.cellArray.length - 1].x * this.cellSize;
        const headY = this.cellArray[this.cellArray.length - 1].y * this.cellSize;
        if (this.checkOwnCollision(this.cellArray) && this.cellArray.length > 4) {
          this.clear();
        }
        if (headX < this.ctx.canvas.width && headX >= 0 && headY < this.ctx.canvas.height && headY >= 0) {
          this.cellArray.forEach(cell => {
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
          this.cellArray.push(new Point(false, this.xCoord, this.yCoord));
          if (((this.cellArray[this.cellArray.length - 1].x * this.cellSize) === this.randomItemArray[0].x * this.cellSize) && ((this.cellArray[this.cellArray.length - 1].y * this.cellSize) === this.randomItemArray[0].y * this.cellSize)) {
            this.randomItemArray.splice(0, 1);
            this.maxLength++;
            let newRandom = this.generateRandomItem();
            if (this.cellArray.includes(newRandom)) {
              newRandom = this.generateRandomItem();
            }
            this.drawCell(newRandom, 'green');
            this.randomItemArray.push(newRandom);
          }
          if (this.cellArray.length > this.maxLength) {
            this.drawCell(this.cellArray[0], 'white');
            this.cellArray.splice(0, 1);
          }
        }
      }
    }, 200);
  }

  roundToPrecision(x, precision): number {
    const y = +x + (precision === undefined ? 0.5 : precision / 2);
    return y - (y % (precision === undefined ? 1 : +precision));
  }

  checkOwnCollision(array: Array<Point>): boolean {
    return (new Set(array)).size !== array.length;
  }

  generateRandomItem(): Point {
    const min = Math.ceil(0);
    const max = Math.floor(this.ctx.canvas.width);
    return new Point(true, this.roundToPrecision(Math.floor(Math.random() * (max - min + 1)) + min / this.cellSize, this.cellSize) /
      this.cellSize, this.roundToPrecision(Math.floor(Math.random() * (max - min + 1)) + min / this.cellSize, this.cellSize) / this.cellSize);
  }

  clear(): void {
    clearInterval(this.interval);
    this.cellArray = [];
    this.randomItemArray = [];
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
}

export class Point {
  isItem: boolean;
  x: number;
  y: number;

  constructor(isItem: boolean, x: number, y: number) {
    this.isItem = isItem;
    this.x = x;
    this.y = y;
  }
}
