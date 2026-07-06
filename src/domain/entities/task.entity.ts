export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export class Task {
  id!: string;
  title!: string;
  description?: string;
  status!: TaskStatus;
  created_at!: Date;
  user_id!: string;
}
