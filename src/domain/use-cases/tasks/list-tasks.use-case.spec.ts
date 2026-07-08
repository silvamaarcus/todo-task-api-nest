import { faker } from '@faker-js/faker';
import { TaskType } from '@prisma/client';

import { ITaskRepository } from '@/domain/repositories/task.repository';

import { ListTasksUseCase } from './list-tasks.use-case';

const taskRepositoryMock: jest.Mocked<ITaskRepository> = {
  create: jest.fn(),
  findAllByUserId: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('ListTasksUseCase', () => {
  let createTaskUseCase: ListTasksUseCase;

  beforeEach(() => {
    createTaskUseCase = new ListTasksUseCase(taskRepositoryMock);
    jest.clearAllMocks();
  });

  it('should list tasks successfully', async () => {
    const userId = faker.string.uuid();
    const task1 = {
      id: faker.string.uuid(),
      title: 'Task 1',
      description: 'Description for Task 1',
      status: TaskType.TODO,
      user_id: userId,
      created_at: new Date(),
    };

    const task2 = {
      id: faker.string.uuid(),
      title: 'Task 2',
      description: 'Description for Task 2',
      status: TaskType.IN_PROGRESS,
      user_id: userId,
      created_at: new Date(),
    };

    taskRepositoryMock.findAllByUserId.mockResolvedValue([task1, task2]);

    const result = await createTaskUseCase.execute({ user_id: userId });

    expect(result).toBeTruthy();
    expect(result.tasks).toHaveLength(2);
    expect(result.tasks[0].id).toBe(task1.id);
    expect(result.tasks[0].title).toBe(task1.title);
    expect(result.tasks[1].id).toBe(task2.id);
    expect(result.tasks[1].title).toBe(task2.title);
  });

  it('should return an empty list if no tasks are found', async () => {
    const userId = faker.string.uuid();

    taskRepositoryMock.findAllByUserId.mockResolvedValue([]);

    const result = await createTaskUseCase.execute({ user_id: userId });

    expect(result).toBeTruthy();
    expect(result.tasks).toHaveLength(0);
  });
});
