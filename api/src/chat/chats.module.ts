import { Module } from '@nestjs/common';
import { ChatService } from './chats.service';
import { ChatGateway } from './chats.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
