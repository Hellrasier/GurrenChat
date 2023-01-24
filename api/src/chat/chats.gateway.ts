import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { ChatService } from './chats.service';
import { UserDto } from './chats.dto';
import { User } from '../shared/decorators/user';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private chatService: ChatService) {}

  afterInit() {
    console.log(`WebSocketServer stated`);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.conn.remoteAddress}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.conn.remoteAddress}`);
  }

  @UseGuards(AuthGuard('jwt'))
  @SubscribeMessage('connect-chat')
  async joinChat(
    client: Socket,
    data: { chatId: string },
    @User() user: UserDto,
  ) {
    await this.chatService.addUserToChat(data.chatId, user.id);
    client.join('' + data.chatId);
    client.emit('chat', `Succesfully connected ${user.id} to ${data.chatId}`);
  }

  @UseGuards(AuthGuard('jwt'))
  @SubscribeMessage('send-message')
  async sendMessage(
    _client: Socket,
    data: { chatId: string; text: string },
    @User() user: UserDto,
  ) {
    await this.chatService.sendMessage(data.chatId, user, data.text);
  }
}
