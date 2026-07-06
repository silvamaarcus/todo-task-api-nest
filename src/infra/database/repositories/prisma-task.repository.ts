import { Injectable } from '@nestjs/common';

import { Task } from '@/domain/entities/task.entity';
import { ITaskRepository } from '@/domain/repositories/task.repository';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PrismaTaskRepository implements ITaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(task: Task): Promise<Task> {
    return this.prisma.task.create({ data: task });
  }

  async findAllByUserId(userId: string): Promise<Task[]> {
    return this.prisma.task.findMany({ where: { user_id: userId } });
  }

  async findById(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({ where: { id } });
  }

  async update(task: Task): Promise<Task> {
    return this.prisma.task.update({
      where: { id: task.id },
      data: task,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
  }
}
