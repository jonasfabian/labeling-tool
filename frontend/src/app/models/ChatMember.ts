export class ChatMember {
  id: number;
  chatId: number;
  userId: number;

  constructor(id: number, chatId: number, userId: number) {
    this.id = id;
    this.chatId = chatId;
    this.userId = userId;
  }
}
