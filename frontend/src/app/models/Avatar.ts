export class Avatar {
  id: number;
  userId: number;
  avatar: Array<number>;

  constructor(id: number, userId: number, avatar: Array<number>) {
    this.id = id;
    this.userId = userId;
    this.avatar = avatar;
  }
}
