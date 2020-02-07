import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {ApiService} from '../../../services/api.service';

@Component({
  selector: 'app-check-more',
  templateUrl: './check-more.component.html',
  styleUrls: ['./check-more.component.scss']
})
export class CheckMoreComponent {

  constructor(public dialogRef: MatDialogRef<CheckMoreComponent>, private router: Router, private apiService: ApiService) {
  }

  no(): void {
    this.close();
    this.router.navigate(['/overview']);
  }

  close(): void {
    this.dialogRef.close();
    // TODO not sure this component makes sense as we ignore the response anyway and instead go over the service.
    this.apiService.showTenMoreQuest = false;
  }
}
