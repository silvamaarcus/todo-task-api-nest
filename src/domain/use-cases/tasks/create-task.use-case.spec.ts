import { faker } from '@faker-js/faker';
import { TaskType } from '@prisma/client';

import { ITaskRepository } from '@/domain/repositories/task.repository';

import { CreateTaskUseCase } from './create-task.use-case';

const taskRepositoryMock: jest.Mocked<ITaskRepository> = {
  create: jest.fn(),
  findAllByUserId: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('CreateTaskUseCase', () => {
  let createTaskUseCase: CreateTaskUseCase;

  beforeEach(() => {
    createTaskUseCase = new CreateTaskUseCase(taskRepositoryMock);
    jest.clearAllMocks();
  });

  it('should create a task successfully', async () => {
    const id = faker.string.uuid();
    const userId = faker.string.uuid();
    const title = 'Teste 1';
    const description = 'Descrição do Teste 1';
    const status = TaskType.TODO;

    const task = {
      user_id: userId,
      title: title,
      description: description,
      status: status,
    };

    taskRepositoryMock.create.mockResolvedValue({
      id: id,
      title: title,
      description: description,
      status: status,
      user_id: userId,
      created_at: new Date(),
    }); // Simula o retorno do Repository após criar a task

    const result = await createTaskUseCase.execute(task);

    expect(result).toBeTruthy();
    expect(result.id).toBe(id);
    expect(result.title).toBe(title);
    expect(result.description).toBeDefined();
    expect(result.description).toBe(description);
    expect(result.status).toBe(status);
    expect(result.user_id).toBe(userId);
  });

  it('should successfully create a task without a description', async () => {
    const id = faker.string.uuid();
    const userId = faker.string.uuid();
    const title = 'Teste 2';
    const description = ''; // Sem descrição
    const status = TaskType.TODO;

    const task = {
      user_id: userId,
      title: title,
      description: description,
      status: status,
    };

    taskRepositoryMock.create.mockResolvedValue({
      id: id,
      title: title,
      description: description || null,
      status: status,
      user_id: userId,
      created_at: new Date(),
    }); // Simula o retorno do Repository após criar a task

    const result = await createTaskUseCase.execute(task);

    expect(result).toBeTruthy();
    expect(result.id).toBe(id);
    expect(result.title).toBe(title);
    expect(result.description).toBe(undefined);
    expect(result.status).toBe(status);
    expect(result.user_id).toBe(userId);
  });

  it('should successfully create a task with IN_PROGRESS status', async () => {
    const id = faker.string.uuid();
    const userId = faker.string.uuid();
    const title = 'Teste 3';
    const description = 'Descrição do Teste 4';
    const status = TaskType.IN_PROGRESS;

    const task = {
      user_id: userId,
      title: title,
      description: description,
      status: status,
    };

    taskRepositoryMock.create.mockResolvedValue({
      id: id,
      title: title,
      description: description,
      status: status,
      user_id: userId,
      created_at: new Date(),
    }); // Simula o retorno do Repository após criar a task

    const result = await createTaskUseCase.execute(task);

    expect(result).toBeTruthy();
    expect(result.id).toBe(id);
    expect(result.title).toBe(title);
    expect(result.description).toBe(description);
    expect(result.status).toBe(status);
    expect(result.user_id).toBe(userId);
  });

  it('should successfully create a task with DONE status', async () => {
    const id = faker.string.uuid();
    const userId = faker.string.uuid();
    const title = 'Teste 4';
    const description = 'Descrição do Teste 4';
    const status = TaskType.DONE;

    const task = {
      user_id: userId,
      title: title,
      description: description,
      status: status,
    };

    taskRepositoryMock.create.mockResolvedValue({
      id: id,
      title: title,
      description: description,
      status: status,
      user_id: userId,
      created_at: new Date(),
    }); // Simula o retorno do Repository após criar a task

    const result = await createTaskUseCase.execute(task);

    expect(result).toBeTruthy();
    expect(result.id).toBe(id);
    expect(result.title).toBe(title);
    expect(result.description).toBe(description);
    expect(result.status).toBe(status);
    expect(result.user_id).toBe(userId);
  });

  it('should set TODO as default status when status is undefined', async () => {
    const id = faker.string.uuid();
    const userId = faker.string.uuid();
    const title = 'Teste 5';
    const description = 'Descrição do Teste 5';
    const status = undefined; // Status indefinido

    const task = {
      user_id: userId,
      title: title,
      description: description,
      status: status,
    };

    taskRepositoryMock.create.mockResolvedValue({
      id: id,
      title: title,
      description: description,
      status: TaskType.TODO, // Define o status como TODO
      user_id: userId,
      created_at: new Date(),
    }); // Simula o retorno do Repository após criar a task

    const result = await createTaskUseCase.execute(task);

    expect(result).toBeTruthy();
    expect(result.id).toBe(id);
    expect(result.title).toBe(title);
    expect(result.description).toBe(description);
    expect(result.status).toBe(TaskType.TODO); // Verifica se o status é definido como TODO
    expect(result.user_id).toBe(userId);
  });
});
