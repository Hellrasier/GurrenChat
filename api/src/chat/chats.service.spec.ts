import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chats.service';
import { PrismaClient, User } from '@prisma/client';

describe('ChatService', () => {
  let service: ChatService;
  let prisma: PrismaClient;
  let user: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: PrismaClient,
          useValue: new PrismaClient(),
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    prisma = module.get<PrismaClient>(PrismaClient);
    user = await prisma.user.create({
      data: {
        username: 'testuser',
        password: 'testpassword',
      },
    });
  });

  afterEach(async () => {
    await prisma.chatRoom.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('createChat', () => {
    it('should create a new chat', async () => {
      const name = 'Test Chat';
      const result = await service.createChat(name, user);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name', name);
    });
  });

  describe('addUserToChat', () => {
    it('should add a user to a chat', async () => {
      // Create a chat and a user
      const chat = await prisma.chatRoom.create({
        data: {
          id: 'testid',
          name: 'Test Chat',
          createdBy: {
            connect: { id: 1 },
          },
          users: {
            connect: { id: 1 },
          },
        },
      });

      // Add the user to the chat
      await service.addUserToChat(chat.id, user.id);

      // Check that the user is in the chat
      const updatedChat = await prisma.chatRoom.findFirst({
        where: { id: chat.id },
        include: { users: true },
      });
      expect(updatedChat.users.map((u) => u.id)).toContain(user.id);
    });
  });

  describe('removeUserFromChat', () => {
    let chatId: string;
    let userId: number;

    beforeEach(async () => {
      // create a test chat
      const testChat = await service.createChat('test chat', { id: 1 });
      chatId = testChat.id;
      userId = 1;
      await service.addUserToChat(chatId, userId);
    });

    it('should remove the user from the chat', async () => {
      await service.removeUserFromChat(chatId, userId);
      const updatedChat = await service.getChatById(chatId);
      expect(updatedChat.users.find((u: any) => u.id === userId)).toBeFalsy();
    });

    it('should throw an error if the user is not in the chat', async () => {
      try {
        await service.removeUserFromChat(chatId, 2);
      } catch (e) {
        expect(e).toEqual(new Error('User is not in the chat'));
      }
    });
  });

  describe('sendMessage', () => {
    it('should send message and return it', async () => {
      const user = { id: 1 };
      const chat = await prisma.chatRoom.create({
        data: {
          id: 'exampleid',
          name: 'chat',
          createdBy: { connect: { id: user.id } },
          users: { connect: { id: user.id } },
        },
      });
      const text = 'hello world';
      const message = await service.sendMessage(chat.id, user, text);
      expect(message).toEqual({ text });
    });
  });

  describe('getChatMessages', () => {
    it('should return the messages for a given chat room', async () => {
      const user = { id: 1 };
      const chat = await service.createChat('Test Chat', user);
      await service.sendMessage(chat.id, user, 'Hello');
      await service.sendMessage(chat.id, user, 'World');
      const messages = await service.getChatMessages(chat.id);
      expect(messages.length).toBe(2);
      expect(messages[0].text).toBe('Hello');
      expect(messages[1].text).toBe('World');
    });
  });
});
