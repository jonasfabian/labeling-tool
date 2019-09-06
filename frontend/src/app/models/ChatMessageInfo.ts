export class ChatMessageInfo {
  chatId: number;
  username: string;
  message: string;

  constructor(chatId: number, username: string, message: string) {
    this.chatId = chatId;
    this.username = username;
    this.message = message;
  }
}
