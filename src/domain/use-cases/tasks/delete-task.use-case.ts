import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskType } from '@prisma/client';

import type { ITaskRepository } from '@/domain/repositories/task.repository';

export interface DeleteTaskInput {
  id: string;
  user_id: string;
}

export interface DeleteTaskOutput {
  id: string;
  title: string;
  description?: string;
  status?: TaskType;
  user_id: string;
}

@Injectable()
export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(deleteTaskParams: DeleteTaskInput): Promise<DeleteTaskOutput> {
    const taskAlreadyExists = await this.taskRepository.findById(
      deleteTaskParams.id,
    );

    if (!taskAlreadyExists) {
      throw new NotFoundException('Task not found');
    }

    // Verifica se a task pertence ao usuário que está tentando acessá-la
    if (taskAlreadyExists.user_id !== deleteTaskParams.user_id) {
      throw new ForbiddenException(
        'You are not authorized to delete this task',
      );
    }

    await this.taskRepository.delete(
      deleteTaskParams.id,
      deleteTaskParams.user_id,
    );

    return {
      id: taskAlreadyExists.id,
      title: taskAlreadyExists.title,
      description: taskAlreadyExists.description || undefined,
      status: taskAlreadyExists.status,
      user_id: taskAlreadyExists.user_id,
    };
  }
}
