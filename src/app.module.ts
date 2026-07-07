import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { envValidationSchema } from '@/config/env.validation';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaModule } from '@/prisma/prisma.module';

import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    PrismaModule,
    DatabaseModule,
    AuthModule,
  ],
})
export class AppModule {}
