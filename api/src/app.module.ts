import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL),
    AuthModule,
    UsersModule,
  ],
  controllers: [UsersController],
  providers: [],
})
export class AppModule {}
