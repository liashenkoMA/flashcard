import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.schema';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let mockJwtService: any;
  let mockUserModel: any;

  beforeEach(async () => {
    jest.resetAllMocks();

    mockUserModel = jest.fn();

    mockUserModel = jest.fn();

    mockUserModel.findOne = jest.fn();
    mockUserModel.findById = jest.fn();
    mockUserModel.findOneAndUpdate = jest.fn();
    mockUserModel.findByIdAndDelete = jest.fn();

    mockJwtService = {
      verifyAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('validateAndGetPayload', () => {
    it('Ошибка пользователь не авторизован', async () => {
      const request = { cookies: {} };

      await expect(
        (service as any).validateAndGetPayload(request),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Ошибка невалидный токен', async () => {
      const request = { cookies: { session_flashcard: '1234' } };

      mockJwtService.verifyAsync.mockRejectedValue(new Error());

      await expect(
        (service as any).validateAndGetPayload(request),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Пользователь найден', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ sub: 'user_id' });

      const request = {
        cookies: { session_flashcard: 'valid_token' },
      } as any;

      const result = await (service as any).validateAndGetPayload(request);

      expect(result).toEqual({ sub: 'user_id' });
    });
  });

  describe('createUser', () => {
    it('Ошибка пользователь уже существует', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'user_id' }),
      });

      await expect(
        service.createUser({
          name: 'Иван',
          email: 'test@mail.com',
          password: '123',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('Пользователь успешно создан', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt' as any);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hash' as any);

      const saveMock = jest.fn().mockResolvedValue({
        _id: 'user_id',
      });

      mockUserModel.mockImplementation(() => ({
        save: saveMock,
      }));

      const result = await service.createUser({
        name: 'Иван',
        email: 'test@mail.com',
        password: '123',
      });

      expect(result).toEqual({
        data: 'Спасибо за регистрацию, пользователь успешно создан!',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('123', 'salt');
      expect(saveMock).toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('Ошибка пользователь не существует', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getUser({ cookies: {} } as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('Пользователь найден', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          name: 'Иван',
          email: 'test@mail.ru',
        }),
      });

      const result = await service.getUser({ cookies: {} } as any);

      expect(result).toEqual({
        name: 'Иван',
        email: 'test@mail.ru',
      });
    });
  });

  describe('updateUser', () => {
    it('Ошибка пользователь не найден', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateUser({} as any, { cookies: {} } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('Ошибка неверный пароль', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          password: 'hashed',
        }),
      });

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as any);

      await expect(
        service.updateUser(
          {
            currentPassword: 'wrong',
          } as any,
          { cookies: {} } as any,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('Ошибка новый пароль совпадает со старым', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          password: 'hashed',
          email: 'test@mail.ru',
        }),
      });

      jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValueOnce(true as any)
        .mockResolvedValueOnce(true as any);

      await expect(
        service.updateUser(
          {
            currentPassword: '123',
            newPassword: '123',
          } as any,
          { cookies: {} } as any,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('Успешное обновление без смены пароля', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          password: 'hashed',
          email: 'old@mail.ru',
        }),
      });

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as any);

      mockUserModel.findOneAndUpdate.mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({
            name: 'Максим',
            email: 'new@mail.ru',
          }),
        }),
      });

      const result = await service.updateUser(
        {
          name: 'Максим',
          email: 'new@mail.ru',
          currentPassword: '123',
        } as any,
        { cookies: {} } as any,
      );

      expect(result).toEqual({
        name: 'Максим',
        email: 'new@mail.ru',
      });
    });

    it('Успешное обновление со сменой пароля', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          password: 'hashed',
          email: 'old@mail.ru',
        }),
      });

      jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValueOnce(true as any)
        .mockResolvedValueOnce(false as any);

      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt' as any);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('new_hash' as any);

      mockUserModel.findOneAndUpdate.mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({
            name: 'Максим',
            email: 'new@mail.ru',
          }),
        }),
      });

      const result = await service.updateUser(
        {
          name: 'Максим',
          email: 'new@mail.ru',
          currentPassword: '123',
          newPassword: '456',
        } as any,
        { cookies: {} } as any,
      );

      expect(result).toEqual({
        name: 'Максим',
        email: 'new@mail.ru',
      });
    });
  });

  describe('deleteUser', () => {
    it('Успешное удаление пользователя', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(undefined),
      });

      const result = await service.deleteUser({ cookies: {} } as any);

      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('user_id');
      expect(result).toBeUndefined();
    });
  });
});
