import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private matSnackBar: MatSnackBar) {
  }

  openError(error: string): void {
    this.matSnackBar.open(error, 'close', {duration: 3000, panelClass: 'snack-bar-error'});
    console.error(error);
  }

  openMessage(message: string): void {
    this.matSnackBar.open(message, 'close', {duration: 3000, panelClass: 'snack-bar-message'});
  }
}
