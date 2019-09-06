import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Chat} from '../../models/Chat';
import {ChatMember} from '../../models/ChatMember';
import {AuthService} from '../../services/auth.service';
import {ChatMessage} from '../../models/ChatMessage';
import {CreateChatComponent} from '../create-chat/create-chat.component';
import {MatDialog} from '@angular/material/dialog';
import {ChatMessageInfo} from '../../models/ChatMessageInfo';

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
  chatMessages: Array<ChatMessageInfo> = [];
  currentChat = new Chat(-1, '');
  @ViewChild('chatInput', {static: false}) chatInput: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.apiService.getChatsFromUser(this.authService.loggedInUser.id).subscribe(c => {
      this.apiService.userArray = c;
    });
  }

  removeChatMember(chatId: number): void {
    this.apiService.removeChatMember(new ChatMember(-1, chatId, this.authService.loggedInUser.id)).subscribe(l => {
    }, () => {}, () => {
      this.apiService.getChatsFromUser(this.authService.loggedInUser.id).subscribe(l => this.apiService.userArray = l);
    });
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

  createChatMember(chat: Chat): void {
    this.chatMessages = [];
    this.apiService.createChatMember(new ChatMember(-1, chat.id, this.authService.loggedInUser.id)).subscribe(() => {
      this.currentChat = chat;
    }, () => {}, () => {
      this.apiService.getAllMessagesFromChat(chat.id).subscribe(l => this.chatMessages = l);
    });
  }

  createChatMessage(): void {
    this.apiService.createChatMessage(new ChatMessage(-1, this.authService.loggedInUser.id, this.chatInput.nativeElement.value)).subscribe(() => {
    }, () => {}, () => {
      this.apiService.getAllMessagesFromChat(chat.id).subscribe(l => this.chatMessages = l);
    });
  }
}
