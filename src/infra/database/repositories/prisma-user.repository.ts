import { Injectable } from '@nestjs/common';

import { User } from '@/domain/entities/user.entity';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    return this.prisma.user.create({ data: user });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
