import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { LoginUseCase } from '@/domain/use-cases/auth/login.use-case';
import { RegisterUseCase } from '@/domain/use-cases/auth/register.use-case';
import { PrismaUserRepository } from '@/infra/database/repositories/prisma-user.repository';

import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

//* O Module é o que cola tudo junto. Ele diz pro NestJS quais controllers e providers (services, use-cases, repositories) estão disponíveis para injeção de dependência dentro do módulo. Ele também pode importar outros módulos, caso precise de algum provider de outro módulo.

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_TOKEN_SECRET')!,
        signOptions: {
          expiresIn: config.get('JWT_REFRESH_TOKEN_SECRET', '7d'), // 7 dias
        },
      }),
    }),
  ],
  controllers: [AuthController], // Define os controllers que estarão disponíveis dentro do módulo.
  // Define quais classes o NestJS precisa instanciar e gerenciar.
  providers: [
    RegisterUseCase,
    LoginUseCase,
    JwtStrategy,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
  ],
  exports: [JwtStrategy],
})
export class AuthModule {}
