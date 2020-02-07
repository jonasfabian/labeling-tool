import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-shortcut',
  templateUrl: './shortcut.component.html',
  styleUrls: ['./shortcut.component.scss']
})
export class ShortcutComponent {
  constructor(public dialogRef: MatDialogRef<ShortcutComponent>,) {
  }

  close = () => this.dialogRef.close();
}
