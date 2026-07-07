import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskType } from '@prisma/client';

import { Task } from '@/domain/entities/task.entity';
import type { ITaskRepository } from '@/domain/repositories/task.repository';

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string | undefined;
  status?: TaskType;
  user_id: string;
}

export interface UpdateTaskOutput {
  id: string;
  title: string;
  description?: string;
  status?: TaskType;
  user_id: string;
}

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(updateTaskParams: UpdateTaskInput): Promise<UpdateTaskOutput> {
    const taskAlreadyExists = await this.taskRepository.findById(
      updateTaskParams.id,
    );

    if (!taskAlreadyExists) {
      throw new NotFoundException('Task not found');
    }

    // Verifica se a task pertence ao usuário que está tentando acessá-la
    if (taskAlreadyExists.user_id !== updateTaskParams.user_id) {
      throw new ForbiddenException(
        'You are not authorized to delete this task',
      );
    }

    // Preserva os valores existentes se não forem fornecidos novos valores para title, description e status
    const newtask = new Task();
    newtask.id = taskAlreadyExists.id;
    newtask.title = updateTaskParams.title ?? taskAlreadyExists.title;
    newtask.description =
      updateTaskParams.description ?? taskAlreadyExists.description;
    newtask.status = updateTaskParams.status ?? taskAlreadyExists.status;
    newtask.user_id = updateTaskParams.user_id;
    newtask.created_at = taskAlreadyExists.created_at;

    const updatedTask = await this.taskRepository.update(
      updateTaskParams.id,
      updateTaskParams.user_id,
      newtask,
    );

    return {
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description || undefined,
      status: updatedTask.status,
      user_id: updatedTask.user_id,
    };
  }
}
