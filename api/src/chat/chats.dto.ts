import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateChatDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class AddUserToChatDto {
  @IsString()
  @IsNotEmpty()
  chatId: string;
}

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  chatId: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}

export class UserDto {
  @IsInt()
  @IsNotEmpty()
  id: number;
}
