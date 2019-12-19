import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss']
})

export class SnakeComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
  }

  cellSize = 40;
  yCoord = 0;
  xCoord = 0;
  currentDirection = '';
  cellArray: Array<Point> = [];
  snakeArray: Array<Point> = [];
  randomItemArray: Array<Point> = [];
  maxLength = 1;
  interval: any;
  score = 0;
  lost = false;
  ctx: CanvasRenderingContext2D;
  @ViewChild('audioPlayer', {static: true}) audioPlayer: ElementRef<HTMLAudioElement>;
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasCard', {static: true}) canvasCard: ElementRef;

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      if (this.currentDirection !== 'right') {
        this.currentDirection = 'left';
      }
    } else if (event.key === 'ArrowRight') {
      if (this.currentDirection !== 'left') {
        this.currentDirection = 'right';
      }
    } else if (event.key === 'ArrowUp') {
      if (this.currentDirection !== 'down') {
        this.currentDirection = 'up';
      }
    } else if (event.key === 'ArrowDown') {
      if (this.currentDirection !== 'up') {
        this.currentDirection = 'down';
      }
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

  fill(): void {
    const numberX = this.ctx.canvas.width / this.cellSize;
    const numberY = this.ctx.canvas.height / this.cellSize;
    const numberOfCells = numberX * numberY;
    let index = 0;
    let x = 0;
    let y = 0;
    while (index < numberOfCells + ((this.cellSize / 2) - 1)) {
      if (y * this.cellSize < this.ctx.canvas.height) {
        if (x * this.cellSize < this.ctx.canvas.width) {
          this.drawCell(new Point(x, y), 'whitesmoke');
          this.cellArray.push(new Point(x, y));
          x++;
          index++;
        } else {
          y++;
          x = 0;
          index++;
        }
      }
    }
  }

  play(): void {
    this.fill();
    this.interval = setInterval(() => {
      if (this.randomItemArray.length === 0) {
        const randomItem = this.generateRandomItem();
        this.randomItemArray.push(randomItem);
        this.drawCell(randomItem, 'green');
      }
      if (this.snakeArray.length === 0) {
        const firstCell = this.generateRandomItem();
        this.xCoord = firstCell.x;
        this.yCoord = firstCell.y;
        this.snakeArray.push(firstCell);
        this.cellArray.splice(0, 1);
      } else {
        const tempArray: Array<Point> = [];
        this.snakeArray.forEach(cell => {
          tempArray.push(cell);
          this.drawCell(cell, 'blue');
        });
        if ((new Set(tempArray)).size !== tempArray.length) {
          clearInterval(this.interval);
          this.apiService.createScore(this.authService.loggedInUser.getValue().id, this.score).subscribe(() => {
          }, () => {
          }, () => {
            this.xCoord = 0;
            this.yCoord = 0;
            this.score = 0;
            this.lost = true;
            this.snakeArray = [];
            this.cellArray = [];
            this.randomItemArray = [];
            this.audioPlayer.nativeElement.src = '../../../../assets/oof.mp3';
            this.audioPlayer.nativeElement.play();
          });
        }
        this.snakeArray = tempArray;
        const headX = this.snakeArray[this.snakeArray.length - 1].x * this.cellSize;
        const headY = this.snakeArray[this.snakeArray.length - 1].y * this.cellSize;
        if (headX < this.ctx.canvas.width && headX >= 0 && headY < this.ctx.canvas.height && headY >= 0) {
          if (this.snakeArray[this.snakeArray.length - 1].x === this.randomItemArray[0].x && this.snakeArray[this.snakeArray.length - 1].y === this.randomItemArray[0].y) {
            this.score = this.score + 10;
            this.maxLength++;
            this.cellArray.splice(this.cellArray.indexOf(this.randomItemArray[0]), 1);
            this.randomItemArray[0] = this.generateRandomItem();
            this.drawCell(this.randomItemArray[0], 'green');
          } else {
            this.drawCell(this.snakeArray[0], 'whitesmoke');
            this.snakeArray.splice(0, 1);
            this.cellArray.push(this.snakeArray[0]);
          }
        } else {
          clearInterval(this.interval);
          this.apiService.createScore(this.authService.loggedInUser.getValue().id, this.score).subscribe(() => {
          }, () => {
          }, () => {
            this.xCoord = 0;
            this.yCoord = 0;
            this.score = 0;
            this.lost = true;
            this.snakeArray = [];
            this.cellArray = [];
            this.randomItemArray = [];
            this.audioPlayer.nativeElement.src = '../../../../assets/oof.mp3';
            this.audioPlayer.nativeElement.play();
          });
        }
      }
      if (this.currentDirection === 'left') {
        this.xCoord--;
      } else if (this.currentDirection === 'right') {
        this.xCoord++;
      } else if (this.currentDirection === 'up') {
        this.yCoord--;
      } else if (this.currentDirection === 'down') {
        this.yCoord++;
      }
      this.snakeArray.push(new Point(this.xCoord, this.yCoord));
      this.cellArray.splice(this.cellArray.indexOf(new Point(this.xCoord, this.yCoord)), 1);
    }, 200);
  }

  roundToPrecision(x, precision): number {
    const y = +x + (precision === undefined ? 0.5 : precision / 2);
    return y - (y % (precision === undefined ? 1 : +precision));
  }

  selfHit(array: Array<Point>): boolean {
    return (new Set(array)).size !== array.length;
  }

  generateRandomItem(): Point {
    const min = 0;
    const max = this.cellArray.length;
    const rdmNumber = this.roundToPrecision(Math.random() * (max - min) + min, 1);
    return this.cellArray[rdmNumber];
  }

  clear(): void {
    clearInterval(this.interval);
    this.lost = false;
    this.score = 0;
    this.cellArray = [];
    this.snakeArray = [];
    this.randomItemArray = [];
    this.currentDirection = '';
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
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
