export class ChatMessage {
  id: number;
  chatMemberId: number;
  message: string;

  constructor(id: number, chatMemberId: number, message: string) {
    this.id = id;
    this.chatMemberId = chatMemberId;
    this.message = message;
  }
}
