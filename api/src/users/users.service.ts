import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { User } from './users.schema';
import { AuthService } from 'src/auth/auth.service';
import { FilterQuery } from 'mongoose';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<string> {
    const { username, password } = createUserDto;
    const hashed = await this.authService.hashPassword(password);
    const user = await this.usersRepository.create({
      username: username,
      password: hashed,
    });
    return this.authService.generateToken(user);
  }

  async login({ username, password }: LoginUserDto): Promise<string> {
    const user = await this.usersRepository.findOne({ username });
    const validated = this.authService.validatePassword(
      password,
      user.password,
    );
    if (validated) return this.authService.generateToken(user);
    else return '';
  }

  getAll() {
    return this.usersRepository.find({});
  }

  get(filters: FilterQuery<User>) {
    return this.usersRepository.findOne(filters);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.findOneAndUpdate({ id }, updateUserDto);
  }

  delete(id: string) {
    return this.usersRepository.remove({ id });
  }
}
