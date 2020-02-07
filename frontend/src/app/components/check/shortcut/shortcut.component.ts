import {Component, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-shortcut',
  templateUrl: './shortcut.component.html',
  styleUrls: ['./shortcut.component.scss']
})
export class ShortcutComponent implements OnInit {

  isInLabeling = false;
  cols = 0;

  constructor(
    public dialogRef: MatDialogRef<ShortcutComponent>,
    private router: Router
  ) {
  }

  ngOnInit() {
    if (this.router.url !== '/label') {
      this.isInLabeling = false;
      this.cols = 4;
    } else {
      this.isInLabeling = true;
      this.cols = 2;
    }
  }

  close(): void {
    this.dialogRef.close();
  }

}
