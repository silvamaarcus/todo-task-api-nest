import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';

import { createAndLoginUser } from './helpers/auth.helper';

describe('Tasks (e2e)', () => {
  let app: INestApplication<App>; // Chama o NestApplication para manipular a aplicação durante os testes
  let prisma: PrismaService; // Chama o PrismaService para manipular o banco de dados durante os testes
  let token: string; // Chama o token de autenticação para manipular a aplicação durante os testes

  // Subir o banco de dados antes de todos os testes
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();

    prisma = moduleFixture.get(PrismaService);

    token = await createAndLoginUser(app); // Criar e logar um usuário antes de todos os testes
  });

  // Reseta o banco de dados após todos os testes
  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Academia',
          description: 'Conhcecer academia do ASBEMGE',
          status: 'TODO',
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.title).toBe('Academia');
      expect(response.body.status).toBe('TODO');
    });

    it('should list tasks', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.tasks).toBeDefined();
      expect(Array.isArray(response.body.tasks)).toBe(true);
    });

    it('should get a task by id', async () => {
      const createTask = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Jantar',
          description: 'Jantar com a família',
          status: 'DONE',
        });

      const taskId = createTask.body.id;

      const response = await request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(taskId);
      expect(response.body.title).toBe('Jantar');
    });

    it('should return 404 when getting a task by an invalid id', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Jantar',
          description: 'Jantar com a família',
          status: 'DONE',
        });

      const taskId = 'invalid-id';

      const response = await request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it('should return 401 when getting a task by id and user id is different', async () => {
      const createTask = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Jantar',
          description: 'Jantar com a família',
          status: 'DONE',
        });

      const taskId = createTask.body.id;

      const response = await request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}2`); // Token de outro usuário

      expect(response.status).toBe(401);
    });

    it('should update a task by id', async () => {
      const createTask = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Jantar',
          description: 'Jantar com a família',
          status: 'DONE',
        });

      const taskId = createTask.body.id;

      const response = await request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Jantar atualizado',
          description: 'Jantar com a família atualizado',
          status: 'TODO',
        });

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(taskId);
      expect(response.body.title).toBe('Jantar atualizado');
      expect(response.body.description).toBe('Jantar com a família atualizado');
      expect(response.body.status).toBe('TODO');
    });

    it('should delete a task by id', async () => {
      const createTask = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Jantar',
          description: 'Jantar com a família',
          status: 'DONE',
        });

      const taskId = createTask.body.id;

      const response = await request(app.getHttpServer())
        .delete(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(taskId);
    });
  });
});
