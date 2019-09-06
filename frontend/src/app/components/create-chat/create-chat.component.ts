import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
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

  @ViewChild('chatNameInput', {static: false}) chatNameInput: ElementRef<HTMLInputElement>;

  ngOnInit() {
    // @ts-ignore
    this.data = this.data.chats;
  }

  createChat(): void {
    this.apiService.createChat(new Chat(-1, this.chatNameInput.nativeElement.value)).subscribe(() => {
      this.close();
    }, () => {
    }, () => {
      this.apiService.getChats().subscribe(c => this.apiService.chatArray = c);
    });
  }

  close(): void {
    this.dialogRef.close();
  }

}
