import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {User} from '../../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
  }

  createUser(): void {
    this.apiService.createUser(new User(-1, 'peter', 'zwerg', 'p.tw@yeet.ch', 'test')).subscribe();
  }

  checkPassword(): void {
  }

}
