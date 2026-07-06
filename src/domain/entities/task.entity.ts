import { TaskType } from '@prisma/client';

export class Task {
  id!: string;
  title!: string;
  description!: string | null;
  status!: TaskType;
  created_at!: Date;
  user_id!: string;
}
