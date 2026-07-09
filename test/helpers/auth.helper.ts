import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export async function createAndLoginUser(
  app: INestApplication,
  email = 'marcus@email.com',
  password = '123456',
): Promise<string> {
  await request(app.getHttpServer()).post('/auth/register').send({
    first_name: 'Marcus',
    last_name: 'Silva',
    email,
    password,
  });

  const login = await request(app.getHttpServer()).post('/auth/login').send({
    email,
    password,
  });

  return login.body.accessToken;
}
