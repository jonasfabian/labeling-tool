export class Sums {
  nonLabeled: number;
  correct: number;
  wrong: number;
  skipped: number;

  constructor(nonLabeled: number, correct: number, wrong: number, skipped: number) {
    this.nonLabeled = nonLabeled;
    this.correct = correct;
    this.wrong = wrong;
    this.skipped = skipped;
  }
}
