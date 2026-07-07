import { Inject, Injectable } from '@nestjs/common';
import { TaskType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import { Task } from '@/domain/entities/task.entity';
import type { ITaskRepository } from '@/domain/repositories/task.repository';

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskType;
  user_id: string;
}

export interface CreateTaskOutput {
  id: string;
  title: string;
  description?: string;
  status?: TaskType;
  user_id: string;
}

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(createTaskParams: CreateTaskInput): Promise<CreateTaskOutput> {
    const task = new Task();
    task.id = uuidv4();
    task.title = createTaskParams.title;
    task.description = createTaskParams.description || null;
    task.status = createTaskParams.status ?? TaskType.TODO;
    task.user_id = createTaskParams.user_id;
    task.created_at = new Date();

    const createdTask = await this.taskRepository.create(task);

    return {
      id: createdTask.id,
      title: createdTask.title,
      description: createdTask.description || undefined,
      status: createdTask.status,
      user_id: createdTask.user_id,
    };
  }
}
