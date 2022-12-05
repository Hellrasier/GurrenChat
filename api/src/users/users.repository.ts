import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from 'src/database/entity.repository';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersRepository extends EntityRepository<UserDocument, User> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }
}
