export class Sums {
  correct: number;
  wrong: number;
  totalTextAudioIndexes: number;

  constructor(correct: number, wrong: number, totalTextAudioIndexes: number) {
    this.correct = correct;
    this.wrong = wrong;
    this.totalTextAudioIndexes = totalTextAudioIndexes;
  }
}
