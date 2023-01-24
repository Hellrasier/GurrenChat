import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { ChatModule } from './chat/chats.module';
import { ChatController } from './chat/chats.controller';

@Module({
  imports: [AuthModule, ChatModule],
  controllers: [AuthController, ChatController],
  providers: [],
})
export class AppModule {}
