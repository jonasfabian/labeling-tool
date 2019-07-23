import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-shortcut',
  templateUrl: './shortcut.component.html',
  styleUrls: ['./shortcut.component.scss']
})
export class ShortcutComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ShortcutComponent>,
  ) { }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close();
  }

}
