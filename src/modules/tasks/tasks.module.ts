import { Module } from '@nestjs/common';

import { CreateTaskUseCase } from '@/domain/use-cases/tasks/create-task.use-case';
import { DeleteTaskUseCase } from '@/domain/use-cases/tasks/delete-task.use-case';
import { GetTaskUseCase } from '@/domain/use-cases/tasks/get-task.use-case';
import { ListTasksUseCase } from '@/domain/use-cases/tasks/list-tasks.use-case';
import { UpdateTaskUseCase } from '@/domain/use-cases/tasks/update-task.use-case';
import { PrismaTaskRepository } from '@/infra/database/repositories/prisma-task.repository';

import { TasksController } from './tasks.controller';

@Module({
  controllers: [TasksController],
  providers: [
    CreateTaskUseCase,
    ListTasksUseCase,
    GetTaskUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    {
      provide: 'ITaskRepository',
      useClass: PrismaTaskRepository,
    },
  ],
})
export class TasksModule {}
