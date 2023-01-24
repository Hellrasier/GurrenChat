import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chats.service';
import { ChatController } from './chats.controller';
import { CreateChatDto, AddUserToChatDto } from './chats.dto';
import { sign } from 'jsonwebtoken';

describe('ChatController', () => {
  let service: ChatService;
  let controller: ChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatService, ChatController],
    }).compile();

    service = module.get<ChatService>(ChatService);
    controller = module.get<ChatController>(ChatController);
  });

  describe('createChat', () => {
    it('should create a new chat', async () => {
      // mock the ChatService's createChat method
      jest.spyOn(service, 'createChat').mockImplementation(() =>
        Promise.resolve({
          id: 'testid',
          name: 'Test Chat',
          createdById: 1,
          createdAt: new Date(),
        }),
      );

      const user = { id: 1, username: 'testuser' };
      const token = sign({ user }, 'secretkey');

      const req = { headers: { authorization: `Bearer ${token}` } };

      const createChatDto: CreateChatDto = { name: 'Test Chat' };

      const result = await controller.createChat(createChatDto, req as any);

      expect(service.createChat).toHaveBeenCalledWith(createChatDto.name, user);
      expect(result).toEqual({ id: 1, name: 'Test Chat' });
    });
  });

  describe('addUserToChat', () => {
    it('should add a user to a chat', async () => {
      // mock the ChatService's addUserToChat method
      jest.spyOn(service, 'addUserToChat').mockImplementation(() =>
        Promise.resolve({
          id: '1',
          name: 'TestChat',
          createdById: 1,
          createdAt: new Date(),
        }),
      );
      const user = { id: 1, username: 'testuser' };
      const token = sign({ user }, 'secretkey');

      const req = { headers: { authorization: `Bearer ${token}` } };

      const addUserToChatDto: AddUserToChatDto = { chatId: '1' };

      await controller.addUserToChat(addUserToChatDto, req as any);

      expect(service.addUserToChat).toHaveBeenCalledWith(
        addUserToChatDto.chatId,
        user.id,
      );
    });
  });

  describe('getChats', () => {
    it('should return a list of chats for a user', async () => {
      // mock the ChatService's getChats method
      const user = { id: 1, username: 'testuser' };
      jest.spyOn(service, 'getChats').mockImplementation(() =>
        Promise.resolve([
          {
            id: '1',
            name: 'Test Chat',
            createdById: 1,
            createdAt: new Date(),
            users: [user],
          },
          {
            id: '2',
            name: 'Test Chat 2',
            createdById: 1,
            createdAt: new Date(),
            users: [user],
          },
        ]),
      );

      const token = sign({ user }, 'secretkey');

      const req = { headers: { authorization: `Bearer ${token}` } };

      const addUserToChatDto: AddUserToChatDto = { chatId: 'teststring' };

      await controller.addUserToChat(addUserToChatDto, req as any);

      expect(service.addUserToChat).toHaveBeenCalledWith(
        addUserToChatDto.chatId,
        user.id,
      );
    });
  });

  describe('addUserToChat', () => {
    it('should add a user to a chat', async () => {
      jest.spyOn(service, 'addUserToChat').mockImplementation(() =>
        Promise.resolve({
          id: 'testid',
          name: 'Test Chat',
          createdById: 1,
          createdAt: new Date(),
        }),
      );

      const user = { id: 1, username: 'testuser' };
      const token = sign({ user }, 'secretkey');

      const req = { headers: { authorization: `Bearer ${token}` } };

      const addUserToChatDto = { chatId: 'testid' };

      await controller.addUserToChat(addUserToChatDto, req as any);

      expect(service.addUserToChat).toHaveBeenCalledWith(
        addUserToChatDto.chatId,
        user.id,
      );
    });
  });
});
