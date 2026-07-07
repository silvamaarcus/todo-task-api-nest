import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import type { IUserRepository } from '@/domain/repositories/user.repository';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  accessToken: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserRepository') // Injeção de dependência Repository, usando o token 'IUserRepository'
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService, // Injeção de dependência JwtService, fornecido pelo módulo JwtModule do NestJS
  ) {}

  async execute(loginUserParams: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(loginUserParams.email); // Verifica se o usuário existe na db

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(
      loginUserParams.password,
      user.password,
    ); // Compara a senha fornecida com a senha armazenada na db usando bcrypt

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    }); // Gera um token JWT com o id e email do usuário

    return { accessToken };
  }
}
