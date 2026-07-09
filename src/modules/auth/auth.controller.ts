import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { LoginUseCase } from '@/domain/use-cases/auth/login.use-case';
import { RegisterUseCase } from '@/domain/use-cases/auth/register.use-case';

import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@ApiTags('Auth') // Define o grupo de rotas no Swagger
@Controller('auth') // Define a rota — @Controller('auth') = /auth
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @ApiOperation({ summary: 'Registrar novo usuário' }) // Define a descrição da rota no Swagger
  @Post('register') // Define a rota — @Controller('auth') + @Post('register') = POST /auth/register
  @HttpCode(HttpStatus.CREATED) // Define o código de status HTTP da resposta. 201 se a criação for bem-sucedida.
  async register(@Body() dto: RegisterDto) {
    return this.registerUseCase.execute(dto);
  } // Pega o body da requisição com @Body() e já valida pelo DTO, e passa para o use-case de registro.

  @ApiOperation({ summary: 'Autenticar usuário' }) // Define a descrição da rota no Swagger
  @Post('login') // Define a rota — @Controller('auth') + @Post('login') = POST /auth/login
  @HttpCode(HttpStatus.OK) // Define o código de status HTTP da resposta. 200 se o login for bem-sucedido.
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  } // Pega o body da requisição com @Body() e já valida pelo DTO, e passa para o use-case de login.
}
