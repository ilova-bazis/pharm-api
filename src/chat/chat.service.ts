import { User, Conversation, Message } from '.prisma/client';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConversationDto } from './dto/conversation.dto';
import { CreateMessageDto } from './dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}
    async getChats(user: User): Promise<ConversationDto[]> {
        if (!user) throw new ForbiddenException('Not authorized');
        const conversationIds = await this.prisma.conversationToUser.findMany({
            where: {
                user_id: user.id,
            },
            include: {
                conversation: true,
            },
        });

        const conversations: { [conversationId: number]: Conversation } = {};
        conversationIds.forEach((val) => {
            if (!conversations[val.conversation_id]) {
                conversations[val.conversation_id] = val.conversation;
            }
        });

        const members = await this.prisma.conversationToUser.findMany({
            where: {
                conversation_id: {
                    in: conversationIds.map((val) => val.conversation_id),
                },
            },
        });

        const mapping: { [conversationId: number]: number[] } = {};
        members.forEach((val) => {
            if (!mapping[val.conversation_id]) {
                mapping[val.conversation_id] = [];
            }
            mapping[val.conversation_id].push(val.user_id);
        });

        const conversationsDto: ConversationDto[] = [];
        conversationIds.forEach((val) => {
            conversationsDto.push(
                new ConversationDto(conversations[val.conversation_id], mapping[val.conversation_id]),
            );
        });

        return conversationsDto;
    }

    async createMessage(user: User, message: CreateMessageDto): Promise<Message> {
        if (!user) throw new ForbiddenException('Not authorized');
        const newMessage = await this.prisma.message.create({
            data: {
                body: message.body,
                message_type: 'TEXT',
                conversation_id: message.conversation_id,
                author_id: user.id,
            },
        });

        return newMessage;
    }

    async createConversation(user: User, dto: CreateConversationDto): Promise<ConversationDto> {
        const newConversation = await this.prisma.conversation.create({
            data: {
                type: 'PRIVATE',
                group_name: null,
                group_image: null,
            },
        });
        const mapConversations = await this.prisma.conversationToUser.create({
            data: {
                conversation_id: newConversation.id,
                user_id: user.id,
            },
        });
        const mapConversations2 = await this.prisma.conversationToUser.create({
            data: {
                conversation_id: newConversation.id,
                user_id: dto.user_id,
            },
        });
        return await this.getOneConversation(user, newConversation.id);
    }

    async getOneConversation(user: User, id: number): Promise<ConversationDto> {
        const conversation = await this.prisma.conversation.findUnique({
            where: {
                id: id,
            },
        });
        if (!conversation) {
            throw new ForbiddenException('Conversation not found');
        }

        const members = await this.prisma.conversationToUser.findMany({
            where: {
                conversation_id: id,
            },
        });
        return new ConversationDto(
            conversation,
            members.map((val) => val.user_id),
        );
    }

    async getMessages(user: User, conversationId: number, messageId: number, count: number): Promise<MessageDto[]> {
        if (!user) throw new ForbiddenException('Not authorized');
        const messages = await this.prisma.message.findMany({
            where: {
                conversation_id: conversationId,
                id: {
                    lt: messageId,
                },
            },
            take: count,
            orderBy: {
                created_at: 'desc',
            },
        });
        return messages.map((val) => {
            return new MessageDto(val);
        });
    }
}
