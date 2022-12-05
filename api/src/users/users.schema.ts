import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Entity, EntityDocument } from 'src/database/entiry.schema';

export type UserDocument = EntityDocument<User>;

@Schema()
export class User extends Entity {
  @Prop({ unique: true })
  username: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
