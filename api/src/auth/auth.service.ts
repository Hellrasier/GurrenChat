import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async register(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
  }

  async login(username: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      throw new Error('Invalid login credentials');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new Error('Invalid login credentials');
    }

    // generate JWT token
    const token = sign(
      { user: { id: user.id, username: user.username } },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      },
    );
    return { user, token };
  }

  async validateUser(id: number) {
    return this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }
}
