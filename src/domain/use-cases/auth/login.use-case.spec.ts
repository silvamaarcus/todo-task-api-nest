import { faker } from '@faker-js/faker';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { IUserRepository } from '@/domain/repositories/user.repository';
import { LoginUseCase } from '@/domain/use-cases/auth/login.use-case';

const mockUserRepository: jest.Mocked<IUserRepository> = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock_token'),
} as unknown as JwtService;

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;

  // Garante que um teste não interfira no outro
  beforeEach(() => {
    loginUseCase = new LoginUseCase(mockUserRepository, mockJwtService);
    jest.clearAllMocks(); // limpa o histórico dos mocks
  });

  it('should throw UnauthorizedException when provided invalid email', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(
      loginUseCase.execute({
        email: 'email@test.com', // Força email inválido
        password: faker.internet.password({ length: 6 }),
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when provided invalid password', async () => {
    const email = faker.internet.email(); // Garante mesmo email

    mockUserRepository.findByEmail.mockResolvedValue({
      id: faker.string.uuid(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: email,
      password: faker.internet.password({ length: 6 }),
      created_at: new Date(),
    });

    await expect(
      loginUseCase.execute({
        email: email,
        password: 'invalid_password', // Força senha inválida
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return accessToken when provided valid credentials', async () => {
    const id = faker.string.uuid(); // Garante mesmo id
    const email = faker.internet.email(); // Garante mesmo email
    const password = faker.internet.password({ length: 6 }); // Garante mesma senha
    const hashedPassword = await bcrypt.hash(password, 10); // Garante mesma senha hasheada

    const input = {
      email: email,
      password: password,
    }; // Simula dados enviados pelo usuário

    mockUserRepository.findByEmail.mockResolvedValue({
      id: faker.string.uuid(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: email,
      password: hashedPassword, // Traz a senha hasheada da db
      created_at: new Date(),
    });

    mockJwtService.sign({
      sub: id,
      email: email,
    }); // Simula o retorno do JwtService p/ obter o token JWT

    const result = await loginUseCase.execute(input);

    expect(result).toBeTruthy();
    expect(result.accessToken).toBeDefined();
  });
});
