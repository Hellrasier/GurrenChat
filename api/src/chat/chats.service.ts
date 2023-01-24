import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserDto } from './chats.dto';
import { ChatGateway } from './chats.gateway';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChatService {
  private readonly prisma: PrismaClient;
  private readonly chatGateway: ChatGateway;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async createChat(name: string, user: UserDto) {
    const id = uuidv4();
    return this.prisma.chatRoom.create({
      data: {
        id,
        name,
        createdBy: { connect: { id: user.id } },
        users: { connect: { id: user.id } },
      },
    });
  }

  async addUserToChat(chatId: string, userId: number) {
    return this.prisma.chatRoom.update({
      where: { id: chatId },
      data: { users: { connect: { id: userId } } },
    });
  }

  async removeUserFromChat(chatId: string, userId: number) {
    return this.prisma.chatRoom.update({
      where: { id: chatId },
      data: { users: { disconnect: { id: userId } } },
    });
  }

  async getChats(userId: number) {
    return this.prisma.chatRoom.findMany({
      where: {
        OR: [{ createdById: userId }, { users: { some: { id: userId } } }],
      },
      include: { users: { select: { id: true, username: true } } },
    });
  }

  async getChatById(chatId: string) {
    return this.prisma.chatRoom.findUnique({
      where: { id: chatId },
      include: { users: { select: { id: true, username: true } } },
    });
  }

  async sendMessage(chatId: string, user: UserDto, text: string) {
    this.chatGateway.server.to('' + chatId).emit('message', { user, text });
    return this.prisma.message.create({
      data: {
        text,
        user: { connect: { id: user.id } },
        chatRoom: { connect: { id: chatId } },
      },
    });
  }

  async getChatMessages(chatId: string) {
    return this.prisma.message.findMany({
      where: { chatRoomId: chatId },
      include: { user: true },
    });
  }
}
