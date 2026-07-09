import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>; // Chama o NestApplication para manipular a aplicação durante os testes
  let prisma: PrismaService; // Chama o PrismaService para manipular o banco de dados durante os testes

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
  });

  // Reseta o banco de dados após todos os testes
  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  // Endpoints de autenticação -> Criar novo usuário
  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          first_name: 'Marcus',
          last_name: 'Silva',
          email: 'marcus@email.com',
          password: '123456',
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.email).toBe('marcus@email.com');
      expect(response.body.password).toBeUndefined();
    });

    it('should return 409 if email already exists', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          first_name: 'Marcus',
          last_name: 'Silva',
          email: 'marcus@email.com',
          password: '123456',
        });

      expect(response.status).toBe(409);
    });
  });

  describe('POST /login', () => {
    it('should login user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'marcus@email.com',
          password: '123456',
        });

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
    });

    it('should return 401 with invalid email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'wrong@email.com',
          password: '123456',
        });

      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'marcus@email.com',
          password: 'wrong_password',
        });

      expect(response.status).toBe(401);
    });
  });
});
