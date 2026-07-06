import { Module } from '@nestjs/common';

import { PrismaTaskRepository } from '@/infra/database/repositories/prisma-task.repository';
import { PrismaUserRepository } from '@/infra/database/repositories/prisma-user.repository';

@Module({
  providers: [PrismaUserRepository, PrismaTaskRepository],
  exports: [PrismaUserRepository, PrismaTaskRepository],
})
export class DatabaseModule {}
