import { faker } from '@faker-js/faker';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TaskType } from '@prisma/client';

import { ITaskRepository } from '@/domain/repositories/task.repository';

import { GetTaskUseCase } from './get-task.use-case';

const taskRepositoryMock: jest.Mocked<ITaskRepository> = {
  create: jest.fn(),
  findAllByUserId: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('GetTaskUseCase', () => {
  let getTaskUseCase: GetTaskUseCase;

  beforeEach(() => {
    getTaskUseCase = new GetTaskUseCase(taskRepositoryMock);
    jest.clearAllMocks();
  });

  it('should retrieve a task successfully', async () => {
    const id = faker.string.uuid();
    const userId = faker.string.uuid();
    const title = 'Teste 1';
    const description = 'Descrição do Teste 1';
    const status = TaskType.TODO;

    const task = {
      id: id,
      user_id: userId,
      title: title,
      description: description,
      status: status,
      created_at: new Date(),
    };

    taskRepositoryMock.findById.mockResolvedValue(task); // Simula o retorno do Repository ao buscar a task pelo ID

    const result = await getTaskUseCase.execute({
      id: id,
      user_id: userId,
    });

    expect(result).toBeTruthy();
    expect(result.id).toBe(id);
    expect(result.title).toBe(title);
    expect(result.description).toBeDefined();
    expect(result.description).toBe(description);
    expect(result.status).toBe(status);
    expect(result.user_id).toBe(userId);
  });

  it('should throw NotFoundException if task does not exist', async () => {
    const id = faker.string.uuid();
    const userId = faker.string.uuid();

    taskRepositoryMock.findById.mockResolvedValue(null); // Simula o retorno do Repository quando a task não é encontrada

    await expect(
      getTaskUseCase.execute({
        id: id,
        user_id: userId,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException when task does not belong to the same user', async () => {
    const id = faker.string.uuid();
    const userId = faker.string.uuid();
    const title = 'Teste 3';
    const description = 'Descrição do Teste 3';
    const status = TaskType.TODO;

    const task = {
      id: id,
      user_id: userId,
      title: title,
      description: description,
      status: status,
      created_at: new Date(),
    };

    taskRepositoryMock.findById.mockResolvedValue(task);

    await expect(
      getTaskUseCase.execute({
        id: id,
        user_id: 'different_user_id', // Força user_id diferente
      }),
    ).rejects.toThrow(ForbiddenException);
  });
});
