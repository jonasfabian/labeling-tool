import {OccurrenceMode} from './check.component';

export enum CheckedOccurrenceLabel {SKIPPED = 'SKIPPED', CORRECT = 'CORRECT', WRONG = 'WRONG'}

export class CheckedOccurrence {
  id: number;
  userId: number;
  label: CheckedOccurrenceLabel;
  mode: OccurrenceMode;


  constructor(id: number, userId: number, label: CheckedOccurrenceLabel, mode: OccurrenceMode) {
    this.id = id;
    this.userId = userId;
    this.label = label;
    this.mode = mode;
  }
}

export interface Occurrence {
  id: number;
  text: string;
}
