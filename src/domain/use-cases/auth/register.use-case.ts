import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { User } from '@/domain/entities/user.entity';
import type { IUserRepository } from '@/domain/repositories/user.repository';

export interface RegisterInput {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface RegisterOutput {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

@Injectable()
export class RegisterUseCase {
  constructor(private readonly userRepository: IUserRepository) {} // Injeção de dependência da camada Repository

  async execute(createUserParams: RegisterInput): Promise<RegisterOutput> {
    const existingUser = await this.userRepository.findByEmail(
      createUserParams.email,
    ); // Verifica se o usuário já existe na db

    if (existingUser) {
      throw new ConflictException('Email already in use.');
    } // Se o usuário já existe, lanço uma exceção de conflito (HTTP 409)

    const hashedPassword = await bcrypt.hash(createUserParams.password, 10); // Hash da senha do usuário usando bcrypt com um salt de 10 rounds

    const user = new User();
    user.id = uuidv4();
    user.first_name = createUserParams.first_name;
    user.last_name = createUserParams.last_name;
    user.email = createUserParams.email;
    user.password = hashedPassword;
    user.created_at = new Date();

    const createdUser = await this.userRepository.create(user);

    return {
      id: createdUser.id,
      first_name: createdUser.first_name,
      last_name: createdUser.last_name,
      email: createdUser.email,
    };
  }
}
