import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-shortcut',
  templateUrl: './shortcut.component.html',
  styleUrls: ['./shortcut.component.scss']
})
export class ShortcutComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ShortcutComponent>,
    private router: Router
  ) { }

  isInLabeling = false;
  cols = 0;

  ngOnInit() {
    if (this.router.url !== '/label') {
      this.isInLabeling = false;
      this.cols = 3;
    } else {
      this.isInLabeling = true;
      this.cols = 2;
    }
  }

  close(): void {
    this.dialogRef.close();
  }

}
