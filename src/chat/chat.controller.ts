import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ConversationDto, CreateMessageDto } from './dto';
import { MessageDto } from './dto/message.dto';

@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get('my')
    async getChats(@GetUser() user: User) {
        return { chats: await this.chatService.getChats(user) }; //this.chatService.getChats(user);
    }

    @Post('start')
    async createConversation(@GetUser() user: User, @Body() dto: CreateConversationDto): Promise<ConversationDto> {
        const newConversation = await this.chatService.createConversation(user, dto);
        return newConversation;
    }

    @Post('message')
    async sendMessage(@GetUser() user: User, @Body() dto: CreateMessageDto): Promise<MessageDto> {
        const newMessage = await this.chatService.createMessage(user, dto);
        return new MessageDto(newMessage);
    }

    @Get('conversation/:id/messages')
    async getMessages(
        @GetUser() user: User,
        @Param('id') conversationId: number,
        @Query('message_id') messageId: number,
        @Query('direction') direction: 'desc' | 'asc',
        @Query('count') count: number,
    ) {
        return { messages: await this.chatService.getMessages(user, conversationId, messageId, direction, count) }; //this.chatService.getMessages(user, conversationId, messageId, count);
    }

    @Get('conversation/:id')
    async getOneConversation(@GetUser() user: User, @Param('id') id: number): Promise<ConversationDto> {
        return await this.chatService.getOneConversation(user, id);
    }
}
