import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hashPassword, validatePassword } from 'metautil';
import { User } from 'src/users/users.schema';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(user: User): Promise<string> {
    return this.jwtService.signAsync(user);
  }

  async hashPassword(password: string): Promise<string> {
    return hashPassword(password);
  }

  async validatePassword(password: string, hashed: string): Promise<boolean> {
    return validatePassword(password, hashed);
  }
}
