import { faker } from '@faker-js/faker';
import { ConflictException } from '@nestjs/common';

import { IUserRepository } from '@/domain/repositories/user.repository';
import { RegisterUseCase } from '@/domain/use-cases/auth/register.use-case';

const mockUserRepository: jest.Mocked<IUserRepository> = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
};

describe('RegisterUseCase', () => {
  let registerUseCase: RegisterUseCase;

  // Garante que um teste não interfira no outro
  beforeEach(() => {
    registerUseCase = new RegisterUseCase(mockUserRepository);
    jest.clearAllMocks(); // limpa o histórico dos mocks
  });

  it('should throw ConflictException if email already exists', async () => {
    mockUserRepository.findByEmail.mockResolvedValue({
      id: faker.string.uuid(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 6 }),
      created_at: new Date(),
    });

    await expect(
      registerUseCase.execute({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 6 }),
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should hash password before creating user', async () => {
    const plainPassword = faker.internet.password({ length: 6 });

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue({
      id: faker.string.uuid(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: 'hashed_password',
      created_at: new Date(),
    });

    const input = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: plainPassword,
    };

    const result = await registerUseCase.execute(input);

    const calledWith = mockUserRepository.create.mock.calls[0][0];

    expect(calledWith.password).not.toBe(plainPassword);
    expect(result).toBeTruthy();
    expect(result.email).toBeDefined();
  });

  it('should return a created task', async () => {
    const first_name = faker.person.firstName();
    const last_name = faker.person.lastName();
    const email = faker.internet.email();

    mockUserRepository.findByEmail.mockResolvedValue(null); // Simula que não há usuário existente com o email fornecido

    const input = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: faker.internet.password({ length: 6 }),
    }; // Simula dados enviados pelo usuário

    mockUserRepository.create.mockResolvedValue({
      id: faker.string.uuid(),
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: 'hashed_password',
      created_at: new Date(),
    }); // Simula o retorno do Repository após criar o usuário

    const result = await registerUseCase.execute(input); // Executa o use-case de registro com os dados de entrada fornecidos

    expect(result).toBeTruthy();
    expect(result.id).toBeDefined();
    expect(result.first_name).toBe(input.first_name);
    expect(result.last_name).toBe(input.last_name);
    expect(result.email).toBe(input.email);
  });
});
