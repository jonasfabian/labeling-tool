import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Chat} from '../../models/Chat';
import {ChatMember} from '../../models/ChatMember';
import {AuthService} from '../../services/auth.service';
import {ChatMessage} from '../../models/ChatMessage';
import {CreateChatComponent} from '../create-chat/create-chat.component';
import {MatDialog} from '@angular/material/dialog';

export interface Chat {
  id: number;
  chatName: string;
}

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
  }

  allChatsArray: Array<Chat> = [];
  userChatArray: Array<Chat> = [];

  ngOnInit() {
    this.apiService.getChatsFromUser(this.authService.loggedInUser.id).subscribe(c => {
      this.userChatArray = c;
    });
  }

  removeChatMember(chatId: number): void {
    this.apiService.removeChatMember(new ChatMember(-1, chatId, this.authService.loggedInUser.id)).subscribe();
  }

  openCreateChatDialog(): void {
    this.apiService.getChats().subscribe(ca => {
      this.allChatsArray = ca;
    }, () => {
    }, () => {
      this.dialog.open(CreateChatComponent, {
        width: '1000px',
        data: {chats: this.allChatsArray}
      });
    });
  }

  createChat(): void {
    this.apiService.createChat(new Chat(-1, 'Stein')).subscribe();
  }

  createChatMember(chatId: number): void {
    this.apiService.createChatMember(new ChatMember(-1, chatId, this.authService.loggedInUser.id)).subscribe();
  }

  createChatMessage(): void {
    this.apiService.createChatMessage(new ChatMessage(-1, this.authService.loggedInUser.id, 'This is a test text. Yeet!!!')).subscribe();
  }


}
