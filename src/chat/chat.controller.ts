import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto';

@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get('my')
    getChats(@GetUser() user: User) {
        return this.chatService.getChats(user);
    }

    @Post('start')
    createConversation(@GetUser() user: User, @Body() dto: CreateConversationDto) {
        const newConversation = this.chatService.createConversation(user, dto);
        return newConversation;
    }

    @Post('message')
    sendMessage(@GetUser() user: User, @Body() dto: CreateMessageDto) {
        const newMessage = this.chatService.createMessage(user, dto);
        return newMessage;
    }

    @Get('conversation/:id/messages')
    getMessages(
        @GetUser() user: User,
        @Param('id') conversationId: number,
        @Query('message_id') messageId: number,
        @Query('count') count: number,
    ) {
        return this.chatService.getMessages(user, conversationId, messageId, count);
    }

    @Get('conversation/:id')
    getOneConversation(@GetUser() user: User, @Param('id') id: number) {
        return this.chatService.getOneConversation(user, id);
    }
}
