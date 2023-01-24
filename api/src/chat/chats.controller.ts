import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ChatService } from './chats.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../shared/decorators/user';
import {
  UserDto,
  CreateChatDto,
  AddUserToChatDto,
  SendMessageDto,
} from './chats.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createChat(@Body() body: CreateChatDto, @User() user: UserDto) {
    return await this.chatService.createChat(body.name, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('add-user')
  async addUserToChat(@Body() body: AddUserToChatDto, @User() user: UserDto) {
    return await this.chatService.addUserToChat(body.chatId, user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  async getChats(@User() user: UserDto) {
    return await this.chatService.getChats(user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('send-message')
  async sendMessage(@Body() body: SendMessageDto, @User() user: UserDto) {
    return await this.chatService.sendMessage(body.chatId, user, body.text);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('messages/:id')
  async getChatMessages(@Param('id') chatId: string) {
    return await this.chatService.getChatMessages(chatId);
  }
}
