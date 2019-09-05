import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Chat} from '../../models/Chat';

@Component({
  selector: 'app-create-chat',
  templateUrl: './create-chat.component.html',
  styleUrls: ['./create-chat.component.scss']
})
export class CreateChatComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CreateChatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Array<Chat>
  ) {
  }

  ngOnInit() {
    // @ts-ignore
    this.data = this.data.chats;
  }

  close(): void {
    this.dialogRef.close();
  }

}
