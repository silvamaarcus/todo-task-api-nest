import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskType } from '@prisma/client';

import type { ITaskRepository } from '@/domain/repositories/task.repository';

export interface GetTaskUseCaseInput {
  id: string;
  user_id: string;
}

export interface GetTaskUseCaseOutput {
  id: string;
  title: string;
  description?: string;
  status?: TaskType;
  user_id: string;
}

@Injectable()
export class GetTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(input: GetTaskUseCaseInput): Promise<GetTaskUseCaseOutput> {
    const taskAlreadyExists = await this.taskRepository.findById(input.id);

    if (!taskAlreadyExists) {
      throw new NotFoundException('Task not found');
    }

    // Verifica se a task pertence ao usuário que está tentando acessá-la
    if (taskAlreadyExists.user_id !== input.user_id) {
      throw new ForbiddenException(
        'You are not authorized to access this task',
      );
    }

    return {
      id: taskAlreadyExists.id,
      title: taskAlreadyExists.title,
      description: taskAlreadyExists.description || undefined,
      status: taskAlreadyExists.status,
      user_id: taskAlreadyExists.user_id,
    };
  }
}
