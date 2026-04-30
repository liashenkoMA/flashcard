import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  const mockUserModel = {
    findOne: jest.fn(),
  };
  const mockJwtService = {
    signAsync: jest.fn(),
  };
  const mockUser = {
    _id: 'user_id',
    email: 'test@mail.com',
    password: 'hash',
    name: 'Иван',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.resetAllMocks();
  });

  it('Ошибка, если пользователя не существует', async () => {
    mockUserModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.signIn('test@mail.ru', '1234')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('Ошибка, если почта или пароль не верные', async () => {
    mockUserModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    });

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await expect(service.signIn('test@mail.com', 'qwer')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('Успешная авторизация', async () => {
    mockUserModel.findOne.mockReturnValue({
      exec: jest.fn().mockReturnValue(mockUser),
    });

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    mockJwtService.signAsync.mockResolvedValue('jwt_token');

    const result = await service.signIn('test@mail.ru', '1234');

    expect(result).toEqual({
      access_token: 'jwt_token',
      name: 'Иван',
    });
    expect(mockJwtService.signAsync).toHaveBeenCalledWith(
      { sub: mockUser._id, username: mockUser.email },
      { expiresIn: '7d' },
    );
  });
});
