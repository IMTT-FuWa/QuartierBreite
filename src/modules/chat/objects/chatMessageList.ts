import { ChatMessage } from './chatMessage';
export class ChatMessageList {
    public messages: ChatMessage[];

    constructor(messages: ChatMessage[]) {
        this.messages = messages;
    }
}
