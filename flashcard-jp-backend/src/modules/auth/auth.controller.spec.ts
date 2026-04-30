import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = { signIn: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('Успешное выполнение запроса', async () => {
    const mockResult = { access_token: 'jwt_token', name: 'Иван' };
    mockAuthService.signIn.mockResolvedValue(mockResult);

    const dto = {
      email: 'test@mail.com',
      password: '123',
      name: 'Иван',
      learningProgress: [],
    };

    const result = await controller.signIn(dto);

    expect(mockAuthService.signIn).toHaveBeenCalledWith(
      dto.email,
      dto.password,
    );

    expect(result).toEqual(mockResult);
  });

  it('Ошибка UnauthorizedException', async () => {
    mockAuthService.signIn.mockRejectedValue(new UnauthorizedException());

    const dto = {
      email: 'test@mail.com',
      password: 'wrong',
      name: 'Иван',
      learningProgress: [],
    };

    await expect(controller.signIn(dto)).rejects.toThrow(UnauthorizedException);
  });

  it('Ошибка NotFoundException', async () => {
    mockAuthService.signIn.mockRejectedValue(new NotFoundException());

    const dto = {
      email: 'unknown@mail.com',
      password: '123',
      name: 'Иван',
      learningProgress: [],
    };

    await expect(controller.signIn(dto)).rejects.toThrow(NotFoundException);
  });
});
