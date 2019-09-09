export class ChatUser {
  public name: string;
  public lastMsg: string;
  public timestamp: Date;
  constructor(name?, msg?, timestamp?) {
    this.name = name;
    this.lastMsg = msg;
    this.timestamp = timestamp;
  }
}
