import { faker } from '@faker-js/faker';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TaskType } from '@prisma/client';

import { ITaskRepository } from '@/domain/repositories/task.repository';

import { UpdateTaskUseCase } from './update-task.use-case';

const taskRepositoryMock: jest.Mocked<ITaskRepository> = {
  create: jest.fn(),
  findAllByUserId: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('UpdateTaskUseCase', () => {
  let updateTaskUseCase: UpdateTaskUseCase;

  beforeEach(() => {
    updateTaskUseCase = new UpdateTaskUseCase(taskRepositoryMock);
    jest.clearAllMocks();
  });

  it('should update a task successfully', async () => {
    const taskId = faker.string.uuid();
    const userId = faker.string.uuid();
    const title = 'Limpar a cama do quarto';
    const description = 'Limpar a cama do quarto e organizar o guarda-roupa';
    const status = TaskType.IN_PROGRESS;

    const existingTask = {
      id: taskId,
      title: 'Limpar tudo',
      description: 'Limpar o quarto e organizar a cama',
      status: TaskType.TODO,
      user_id: userId,
      created_at: new Date(),
    };

    taskRepositoryMock.findById.mockResolvedValue(existingTask);

    const updatedTask = {
      ...existingTask,
      title,
      description,
      status,
    };

    taskRepositoryMock.update.mockResolvedValue(updatedTask);

    const result = await updateTaskUseCase.execute({
      id: taskId,
      title,
      description,
      status,
      user_id: userId,
    });

    expect(result).toBeTruthy();
    expect(result.id).toBe(taskId);
    expect(result.title).toBe(title);
    expect(result.description).toBe(description);
    expect(result.status).toBe(status);
    expect(result.user_id).toBe(userId);
  });

  it('should update a task successfully without description', async () => {
    const taskId = faker.string.uuid();
    const userId = faker.string.uuid();
    const title = 'Limpar a cama do quarto';
    const description = ''; // Sem descrição
    const status = TaskType.IN_PROGRESS;

    const existingTask = {
      id: taskId,
      title: 'Limpar tudo',
      description: 'Limpar o quarto e organizar a cama',
      status: TaskType.TODO,
      user_id: userId,
      created_at: new Date(),
    };

    taskRepositoryMock.findById.mockResolvedValue(existingTask);

    const updatedTask = {
      ...existingTask,
      title,
      description,
      status,
    };

    taskRepositoryMock.update.mockResolvedValue(updatedTask);

    const result = await updateTaskUseCase.execute({
      id: taskId,
      title,
      description,
      status,
      user_id: userId,
    });

    expect(result).toBeTruthy();
    expect(result.id).toBe(taskId);
    expect(result.title).toBe(title);
    expect(result.description).toBe(description || undefined);
    expect(result.status).toBe(status);
    expect(result.user_id).toBe(userId);
  });

  it('should throw NotFoundException if task does not exist', async () => {
    const taskId = faker.string.uuid();
    const userId = faker.string.uuid();

    taskRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      updateTaskUseCase.execute({
        id: taskId,
        title: 'Some title',
        description: 'Some description',
        status: TaskType.TODO,
        user_id: userId,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException if user is not authorized to update the task', async () => {
    const taskId = faker.string.uuid();
    const userId = faker.string.uuid();
    const anotherUserId = faker.string.uuid();

    const existingTask = {
      id: taskId,
      title: 'Limpar tudo',
      description: 'Limpar o quarto e organizar a cama',
      status: TaskType.TODO,
      user_id: anotherUserId, // Task pertence a outro usuário
      created_at: new Date(),
    };

    taskRepositoryMock.findById.mockResolvedValue(existingTask);

    await expect(
      updateTaskUseCase.execute({
        id: taskId,
        title: 'Some title',
        description: 'Some description',
        status: TaskType.TODO,
        user_id: userId, // Usuário tentando atualizar não é o dono da task
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should preserve existing values if not provided in update', async () => {
    const taskId = faker.string.uuid();
    const userId = faker.string.uuid();

    const existingTask = {
      id: taskId,
      title: 'Limpar tudo',
      description: 'Limpar o quarto e organizar a cama',
      status: TaskType.TODO,
      user_id: userId,
      created_at: new Date(),
    };

    taskRepositoryMock.findById.mockResolvedValue(existingTask);

    const updatedTask = {
      ...existingTask,
      title: 'Updated Title', // Apenas o título será atualizado
    };

    taskRepositoryMock.update.mockResolvedValue(updatedTask);

    const result = await updateTaskUseCase.execute({
      id: taskId,
      title: 'Updated Title',
      user_id: userId,
    });

    expect(result).toBeTruthy();
    expect(result.id).toBe(taskId);
    expect(result.title).toBe('Updated Title');
    expect(result.description).toBe(existingTask.description);
    expect(result.status).toBe(existingTask.status);
    expect(result.user_id).toBe(userId);
  });
});
