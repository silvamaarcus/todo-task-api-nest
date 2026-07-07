import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { LoginUseCase } from '@/domain/use-cases/auth/login.use-case';
import { RegisterUseCase } from '@/domain/use-cases/auth/register.use-case';
import { PrismaUserRepository } from '@/infra/database/repositories/prisma-user.repository';

import { AuthController } from './auth.controller';

//* O Module é o que cola tudo junto. Ele diz pro NestJS quais controllers e providers (services, use-cases, repositories) estão disponíveis para injeção de dependência dentro do módulo. Ele também pode importar outros módulos, caso precise de algum provider de outro módulo.

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET')!,
        signOptions: {
          expiresIn: config.get('JWT_EXPIRES_IN', '7d'),
        },
      }),
    }),
  ],
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
