import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Chat} from '../../models/Chat';
import {ChatMember} from '../../models/ChatMember';
import {AuthService} from '../../services/auth.service';
import {ChatMessage} from '../../models/ChatMessage';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  createChat(): void {
    this.apiService.createChat(new Chat(-1, 'Stein')).subscribe();
  }

  createChatMember(): void {
    this.apiService.createChatMember(new ChatMember(-1, 1, this.authService.loggedInUser.id)).subscribe();
  }

  createChatMessage(): void {
    this.apiService.createChatMessage(new ChatMessage(-1, this.authService.loggedInUser.id, 'This is a test text. Yeet!!!')).subscribe();
  }


}
