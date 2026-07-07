import { Inject, Injectable } from '@nestjs/common';
import { TaskType } from '@prisma/client';

import type { ITaskRepository } from '@/domain/repositories/task.repository';

export interface ListTasksUseCaseInput {
  user_id: string;
}

export interface ListTasksUseCaseOutput {
  tasks: {
    id: string;
    title: string;
    description?: string | undefined;
    status: TaskType;
    user_id: string;
  }[];
}

@Injectable()
export class ListTasksUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(
    userId: ListTasksUseCaseInput,
  ): Promise<ListTasksUseCaseOutput> {
    const tasks = await this.taskRepository.findAllByUserId(userId.user_id);

    // Retorna a lista 'tasks' com os campos desejados. Aplica o map p/ transformar cada task no formato esperado.
    return {
      tasks: tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description || undefined,
        status: task.status,
        user_id: task.user_id,
      })),
    };
  }
}
