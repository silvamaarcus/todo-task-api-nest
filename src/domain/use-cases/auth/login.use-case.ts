import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
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
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {} // Injeção de dependência Repository, usando o token 'IUserRepository'

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

    return { accessToken: '' };
  }
}
