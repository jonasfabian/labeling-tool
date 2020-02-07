import {Component, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {Router} from '@angular/router';
import {ApiService} from '../../../services/api.service';

@Component({
  selector: 'app-check-more',
  templateUrl: './check-more.component.html',
  styleUrls: ['./check-more.component.scss']
})
export class CheckMoreComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CheckMoreComponent>,
    private router: Router,
    private apiService: ApiService
  ) {
  }

  ngOnInit() {
  }

  close(): void {
    this.apiService.showTenMoreQuest = false;
    this.dialogRef.close();
    this.router.navigate(['/overview']);
  }

  yes(): void {
    this.dialogRef.close();
    this.apiService.showTenMoreQuest = false;
  }
}
