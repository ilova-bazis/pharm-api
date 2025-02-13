import { Conversation } from '@prisma/client';

export class ConversationDto {
    id: number;
    type: string;
    users: number[];
    created_at: number;
    group_name: string | null;
    group_image: string | null;
    last_message: number | null;
    constructor(conversation: Conversation, last_message_id: number | null, users: number[]) {
        this.id = conversation.id;
        this.type = conversation.type;
        this.users = users;
        this.group_name = conversation.group_name;
        this.group_image = conversation.group_image;
        this.created_at = conversation.created_at.getTime();
        this.last_message = last_message_id;
    }
}
