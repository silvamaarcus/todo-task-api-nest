import { faker } from '@faker-js/faker';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TaskType } from '@prisma/client';

import { ITaskRepository } from '@/domain/repositories/task.repository';

import { DeleteTaskUseCase } from './delete-task.use-case';

const taskRepositoryMock: jest.Mocked<ITaskRepository> = {
  create: jest.fn(),
  findAllByUserId: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('DeleteTaskUseCase', () => {
  let deleteTaskUseCase: DeleteTaskUseCase;

  beforeEach(() => {
    deleteTaskUseCase = new DeleteTaskUseCase(taskRepositoryMock);
    jest.clearAllMocks();
  });

  it('should delete a task successfully', async () => {
    const taskId = faker.string.uuid();
    const userId = faker.string.uuid();

    const existingTask = {
      id: taskId,
      title: 'Limpar o quarto',
      description: 'Limpar o quarto e organizar a cama',
      status: TaskType.TODO,
      user_id: userId,
      created_at: new Date(),
    };

    taskRepositoryMock.findById.mockResolvedValue(existingTask);
    taskRepositoryMock.delete.mockResolvedValue();

    const result = await deleteTaskUseCase.execute({
      id: taskId,
      user_id: userId,
    });

    expect(result).toBeTruthy();
    expect(result.id).toBe(taskId);
    expect(result.title).toBe(existingTask.title);
  });

  it('should throw NotFoundException if task does not exist', async () => {
    const taskId = faker.string.uuid();
    const userId = faker.string.uuid();

    taskRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      deleteTaskUseCase.execute({
        id: taskId,
        user_id: userId,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException if user is not the owner of the task', async () => {
    const taskId = faker.string.uuid();
    const userId = faker.string.uuid();
    const anotherUserId = faker.string.uuid();

    const existingTask = {
      id: taskId,
      title: 'Limpar o quarto',
      description: 'Limpar o quarto e organizar a cama',
      status: TaskType.TODO,
      user_id: anotherUserId, // Usuário diferente do dono da task
      created_at: new Date(),
    };

    taskRepositoryMock.findById.mockResolvedValue(existingTask);

    await expect(
      deleteTaskUseCase.execute({
        id: taskId,
        user_id: userId, // Usuário tentando deletar não é o dono da task
      }),
    ).rejects.toThrow(ForbiddenException);
  });
});
