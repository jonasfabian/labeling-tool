import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Chat} from '../../models/Chat';
import {ChatMember} from '../../models/ChatMember';
import {ApiService} from '../../services/api.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-create-chat',
  templateUrl: './create-chat.component.html',
  styleUrls: ['./create-chat.component.scss']
})
export class CreateChatComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<CreateChatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Array<Chat>
  ) {
  }

  ngOnInit() {
    // @ts-ignore
    this.data = this.data.chats;
  }

  joinChat(chatId: number): void {
    this.apiService.createChatMember(new ChatMember(-1, chatId, this.authService.loggedInUser.id)).subscribe(l => {
    }, () => {
    }, () => {
      this.apiService.getChatsFromUser(this.authService.loggedInUser.id).subscribe(l => {
        this.apiService.userArray = l;
        this.close();
      });
    });
  }

  close(): void {
    this.dialogRef.close();
  }

}
