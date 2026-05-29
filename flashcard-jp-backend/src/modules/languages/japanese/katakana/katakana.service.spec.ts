import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../../user/user.schema';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { KatakanaService } from './katakana.service';
import { Katakana } from './katakana.schema';

describe('KatakanaService', () => {
  let mockJwtService: any;
  let mockKatakanaModel: any;
  let service: KatakanaService;
  let mockUserModel: any;

  beforeEach(async () => {
    jest.resetAllMocks();

    mockJwtService = {
      verifyAsync: jest.fn(),
    };

    mockUserModel = {
      findById: jest.fn(),
      updateOne: jest.fn(),
    };

    mockKatakanaModel = {
      findOne: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KatakanaService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getModelToken(Katakana.name),
          useValue: mockKatakanaModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<KatakanaService>(KatakanaService);
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
      const payload = { sub: 'user_id' };

      mockJwtService.verifyAsync.mockResolvedValue(payload);

      const request = {
        cookies: { session_flashcard: 'valid_token' },
      } as any;

      const result = await (service as any).validateAndGetPayload(request);

      expect(result).toEqual(payload);
    });
  });

  describe('getKatakana', () => {
    it('Ошибка пользователя не существует', async () => {
      const request = { cookies: { session_flashcard: 'valid_token' } } as any;

      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(service.getKatakana(request)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('Успешное получение катаканы', async () => {
      const request = {} as any;

      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      const mockUser = {
        learningProgress: [
          {
            language: 'jp',
            katakana: ['1'],
          },
        ],
      };

      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockUser),
        }),
      });

      const mockKatakana = [
        { _id: '1', symbol: 'ア' },
        { _id: '2', symbol: 'イ' },
      ];

      mockKatakanaModel.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockKatakana),
      });

      const result = await service.getKatakana(request);

      expect(result).toEqual([
        { _id: '1', symbol: 'ア', learned: true },
        { _id: '2', symbol: 'イ', learned: false },
      ]);
    });
  });

  describe('updateKatakana', () => {
    it('Ошибка пользователь не существует', async () => {
      const request = { cookies: { session_flashcard: 'valid_token' } } as any;

      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateKatakana({ symbol: 'イ' }, request),
      ).rejects.toThrow(NotFoundException);
    });

    it('Ошибка катакана не найдена', async () => {
      const request = {} as any;

      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ email: 'test@mail.ru' }),
      });

      mockKatakanaModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateKatakana({ symbol: 'イ' }, request),
      ).rejects.toThrow(NotFoundException);
    });

    it('Успешное изучение катаканы', async () => {
      const request = {} as any;

      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ email: 'test@mail.ru' }),
      });

      const kana = { _id: '1', symbol: 'イ' };

      mockKatakanaModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(kana),
      });

      mockUserModel.updateOne.mockResolvedValue({});

      const result = await service.updateKatakana({ symbol: 'イ' }, request);

      expect(mockUserModel.updateOne).toHaveBeenCalledTimes(2);

      expect(result).toEqual({
        message: 'イ - выучено',
        katakanaId: '1',
      });
    });
  });
});
