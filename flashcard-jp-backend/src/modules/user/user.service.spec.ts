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
  let mockJwtService;
  let mockUserModel: any;

  beforeEach(async () => {
    jest.resetAllMocks();

    mockUserModel = jest.fn().mockImplementation(() => ({
      save: jest.fn(),
    }));

    mockUserModel.findOne = jest.fn();

    mockUserModel.findOneAndUpdate = jest.fn();

    mockUserModel.findOneAndDelete = jest.fn();

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

  describe(`validateAndGetPayload`, () => {
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
      const payload = { sub: 'user_id' };

      mockJwtService.verifyAsync.mockResolvedValue(payload);

      const request = {
        cookies: { session_flashcard: 'valid_token' },
      } as any;

      const result = await (service as any).validateAndGetPayload(request);

      expect(result).toEqual(payload);
    });
  });

  describe(`createUser`, () => {
    it('Ошибка пользователь уже существует', async () => {
      const dto = {
        name: 'Иван',
        email: 'test@mail.com',
        password: '123',
      };

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'user_id' }),
      });

      await expect(service.createUser(dto)).rejects.toThrow(ConflictException);
    });

    it('Пользователь успешно создан', async () => {
      const dto = {
        name: 'Иван',
        email: 'test@mail.com',
        password: '123',
      };

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hash');

      const saveMock = jest.fn().mockResolvedValue({
        _id: 'user_id',
        ...dto,
      });

      mockUserModel.mockImplementation(() => ({
        save: saveMock,
      }));

      const result = await service.createUser(dto);

      expect(result).toEqual({
        data: 'Спасибо за регистрацию, пользователь успешно создан!',
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('123', 'salt');
      expect(saveMock).toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('Ошибка пользователя не существует', async () => {
      const request = { cookies: { session_flashcard: 'valid_token' } } as any;

      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        username: 'test@mail.ru',
      });

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getUser(request)).rejects.toThrow(NotFoundException);
    });

    it('Пользователь найден', async () => {
      const mockUser = { name: 'Иван', email: 'test@mail.ru' };
      const request = { cookies: { session_flashcard: 'valid_token' } } as any;

      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        username: 'test@mail.ru',
      });

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      await expect(service.getUser(request)).resolves.toEqual({
        name: 'Иван',
        email: 'test@mail.ru',
      });
    });
  });

  describe('updateUser', () => {
    it(`Ошибка пользователь не найден`, async () => {
      const request = { cookies: { session_flashcard: 'valid_token' } } as any;

      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        username: 'test@mail.ru',
      });

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.updateUser({} as any, request)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('Ошибка неверный пароль, обновление невозможно', async () => {
      const mockUser = { name: 'Иван', email: 'test@mail.ru' };
      const request = { cookies: { session_flashcard: 'valid_token' } } as any;

      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        username: 'test@mail.ru',
      });

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(
        service.updateUser({ urrentPassword: '5345345' } as any, request),
      ).rejects.toThrow(BadRequestException);
    });

    it('Ошибка пароль уже используется, попробуйте другой', async () => {
      const mockUser = { name: 'Иван', email: 'test@mail.ru' };
      const request = { cookies: { session_flashcard: 'valid_token' } } as any;

      jest
        .spyOn(service as any, 'validateAndGetPayload')
        .mockResolvedValue(mockUser);

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValueOnce(true) // Проверка текущего пароля isPasswordValid
        .mockResolvedValueOnce(true); // Проверка совпадения паролей isSame

      await expect(
        service.updateUser(
          {
            currentPassword: '123',
            newPassword: '123',
          } as any,
          request,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('Успешное обновление данных пользователя без смены пароля', async () => {
      const mockUser = { name: 'Иван', email: 'test@mail.ru' };
      const mockUpsateUser = { name: 'Максим', email: 'newtest@mail.ru' };
      const request = { cookies: { session_flashcard: 'valid_token' } } as any;

      jest
        .spyOn(service as any, 'validateAndGetPayload')
        .mockResolvedValue(mockUser);

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

      mockUserModel.findOneAndUpdate.mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUpsateUser),
        }),
      });

      await expect(
        service.updateUser(
          {
            name: 'Максим',
            email: 'newtest@mail.ru',
            currentPassword: '123',
          } as any,
          request,
        ),
      ).resolves.toEqual(mockUpsateUser);
    });

    it('Успешное обновление данных пользователя со сменой пароля', async () => {
      const mockUser = { name: 'Иван', email: 'test@mail.ru' };
      const mockUpsateUser = { name: 'Максим', email: 'newtest@mail.ru' };
      const request = { cookies: { session_flashcard: 'valid_token' } } as any;

      jest
        .spyOn(service as any, 'validateAndGetPayload')
        .mockResolvedValue(mockUser);

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('new_hash');

      mockUserModel.findOneAndUpdate.mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUpsateUser),
        }),
      });

      await expect(
        service.updateUser(
          {
            name: 'Максим',
            email: 'newtest@mail.ru',
            currentPassword: '123',
            newPassword: '456',
          } as any,
          request,
        ),
      ).resolves.toEqual(mockUpsateUser);
    });
  });

  describe('deleteUser', () => {
    it('Успешное удаление пользователя', async () => {
      const request = { cookies: { session_flashcard: 'valid_token' } } as any;

      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        username: 'test@mail.ru',
      });

      mockUserModel.findOneAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(undefined),
      });

      const result = await service.deleteUser(request);

      expect(mockUserModel.findOneAndDelete).toHaveBeenCalledWith({
        email: 'test@mail.ru',
      });
      expect(result).toBeUndefined();
    });
  });
});
