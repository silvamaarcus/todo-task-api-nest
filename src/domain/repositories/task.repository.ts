import { Task } from '@/domain/entities/task.entity';

export interface ITaskRepository {
  create(task: Task): Promise<Task>;
  findAllByUserId(userId: string): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  update(task: Task): Promise<Task>;
  delete(id: string): Promise<void>;
}
