import { Message } from '@prisma/client';

export class MessageDto {
    id: number;
    message_type: string;
    conversation_id: number;
    author_id: number;
    body: string;
    created_at: number;
    constructor(message: Message) {
        this.id = message.id;
        this.conversation_id = message.conversation_id;
        this.author_id = message.author_id;
        this.body = message.body;
        this.message_type = message.message_type;
        this.created_at = message.created_at.getTime();
    }
}
