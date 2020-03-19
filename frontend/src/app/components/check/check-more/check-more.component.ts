import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-check-more',
  templateUrl: './check-more.component.html',
  styleUrls: ['./check-more.component.scss']
})
export class CheckMoreComponent {
  constructor(public dialogRef: MatDialogRef<CheckMoreComponent>) {
  }

  no = () => this.dialogRef.close(false);
  yes = () => this.dialogRef.close(true);
}
