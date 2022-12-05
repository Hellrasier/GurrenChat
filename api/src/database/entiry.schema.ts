import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EntityDocument<T> = T & Document;

@Schema()
export abstract class Entity {
  @Prop({ unique: true })
  id?: number;
}
