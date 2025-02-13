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

        const lastMessages: { [conversationId: number]: Message } = {};
        await Promise.all(
            conversationIds.map(async (val) => {
                const lastMessage = await this.prisma.message.findFirst({
                    where: {
                        conversation_id: val.conversation_id,
                    },
                    orderBy: {
                        created_at: 'desc',
                    },
                });
                lastMessages[val.conversation_id] = lastMessage;
            }),
        );

        const conversationsDto: ConversationDto[] = [];
        conversationIds.forEach((val) => {
            const lastMessage = lastMessages[val.conversation_id];
            conversationsDto.push(
                new ConversationDto(conversations[val.conversation_id], lastMessage?.id, mapping[val.conversation_id]),
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
        // Try to find an existing PRIVATE conversation between the two users.
        const existingConversation = await this.prisma.conversation.findFirst({
            where: {
                type: 'PRIVATE',
                AND: [
                    { conversation_to_users: { some: { user_id: user.id } } },
                    { conversation_to_users: { some: { user_id: dto.user_id } } },
                ],
            },
            include: {
                conversation_to_users: true,
            },
        });

        // If a conversation exists and has exactly 2 participants, return it.
        if (existingConversation && existingConversation.conversation_to_users.length === 2) {
            return await this.getOneConversation(user, existingConversation.id);
        }
        // const newConversation = await this.prisma.conversation.create({
        //     data: {
        //         type: 'PRIVATE',
        //         group_name: null,
        //         group_image: null,
        //     },
        // });
        // const mapConversations = await this.prisma.conversationToUser.create({
        //     data: {
        //         conversation_id: newConversation.id,
        //         user_id: user.id,
        //     },
        // });
        // const mapConversations2 = await this.prisma.conversationToUser.create({
        //     data: {
        //         conversation_id: newConversation.id,
        //         user_id: dto.user_id,
        //     },
        // });

        // Otherwise, create a new conversation.
        const newConversation = await this.prisma.conversation.create({
            data: {
                type: 'PRIVATE',
                group_name: null,
                group_image: null,
            },
        });

        // Create the mapping for both users using createMany for brevity.
        await this.prisma.conversationToUser.createMany({
            data: [
                { conversation_id: newConversation.id, user_id: user.id },
                { conversation_id: newConversation.id, user_id: dto.user_id },
            ],
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
        const lastMessage = await this.prisma.message.findFirst({
            where: {
                conversation_id: id,
            },
            orderBy: {
                created_at: 'desc',
            },
        });
        return new ConversationDto(
            conversation,
            lastMessage.id,
            members.map((val) => val.user_id),
        );
    }

    async getMessages(
        user: User,
        conversationId: number,
        messageId: number,
        direction: 'desc' | 'asc',
        count: number,
    ): Promise<MessageDto[]> {
        if (!user) throw new ForbiddenException('Not authorized');
        const messages = await this.prisma.message.findMany({
            where: {
                conversation_id: conversationId,
                id: {
                    gte: direction === 'asc' ? messageId : undefined,
                    lte: direction === 'desc' ? messageId : undefined,
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
