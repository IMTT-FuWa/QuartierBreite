export class ChatMessage {
  message: string;
  image: any;
  sender: string;
  timestamp: string;
  received: boolean;
  read: boolean;
  key: string

  constructor(message: string, sender: string, timestamp: string, read?: boolean, image?: string, key?: string) {
    this.message = message;
    this.sender = sender;
    this.image = image;
    if (key) {
      this.key = key;
    }
    if (!image) {
      this.image = false;
    }
    this.received = false;
    if (read) {
      this.read = read;
    }
    else {
      this.read = false;
    }
    if (!timestamp) {
      this.timestamp = new Date().toISOString();
    }
    else {
      this.timestamp = timestamp;
      // this.toLocaleString();
    }
  }

  isSender(sender: string) {
    return (this.sender == sender);
  }
}
