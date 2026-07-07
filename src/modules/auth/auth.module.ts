import { Module } from '@nestjs/common';

import { LoginUseCase } from '@/domain/use-cases/auth/login.use-case';
import { RegisterUseCase } from '@/domain/use-cases/auth/register.use-case';
import { PrismaUserRepository } from '@/infra/database/repositories/prisma-user.repository';

import { AuthController } from './auth.controller';

//* O Module é o que cola tudo junto. Ele diz pro NestJS quais controllers e providers (services, use-cases, repositories) estão disponíveis para injeção de dependência dentro do módulo. Ele também pode importar outros módulos, caso precise de algum provider de outro módulo.

@Module({
  controllers: [AuthController], // Define os controllers que estarão disponíveis dentro do módulo.
  // Define quais classes o NestJS precisa instanciar e gerenciar.
  providers: [
    RegisterUseCase,
    LoginUseCase,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
  ],
})
export class AuthModule {}
