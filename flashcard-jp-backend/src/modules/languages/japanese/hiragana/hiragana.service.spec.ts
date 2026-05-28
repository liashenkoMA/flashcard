import { Test, TestingModule } from '@nestjs/testing';
import { HiraganaService } from './hiragana.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Hiragana } from './hiragana.schema';
import { User } from '../../../user/user.schema';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('HiraganaService', () => {
  let mockJwtService: any;
  let mockHiraganaModel: any;
  let service: HiraganaService;
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

    mockHiraganaModel = {
      findOne: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HiraganaService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getModelToken(Hiragana.name),
          useValue: mockHiraganaModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<HiraganaService>(HiraganaService);
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

  describe('getHiragana', () => {
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

      await expect(service.getHiragana(request)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('Успешное получение хираганы', async () => {
      const request = {} as any;

      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      const mockUser = {
        learningProgress: [
          {
            language: 'jp',
            hiragana: ['1'],
          },
        ],
      };

      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockUser),
        }),
      });

      const mockHiragana = [
        { _id: '1', symbol: 'あ' },
        { _id: '2', symbol: 'い' },
      ];

      mockHiraganaModel.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockHiragana),
      });

      const result = await service.getHiragana(request);

      expect(result).toEqual([
        { _id: '1', symbol: 'あ', learned: true },
        { _id: '2', symbol: 'い', learned: false },
      ]);
    });
  });

  describe('updateHiragana', () => {
    it('Ошибка пользователь не существует', async () => {
      const request = { cookies: { session_flashcard: 'valid_token' } } as any;

      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateHiragana({ symbol: 'あ' }, request),
      ).rejects.toThrow(NotFoundException);
    });

    it('Ошибка хирагана не найдена', async () => {
      const request = {} as any;

      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ email: 'test@mail.ru' }),
      });

      mockHiraganaModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateHiragana({ symbol: 'あ' }, request),
      ).rejects.toThrow(NotFoundException);
    });

    it('Успешное изучение хираганы', async () => {
      const request = {} as any;

      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ email: 'test@mail.ru' }),
      });

      const kana = { _id: '1', symbol: 'あ' };

      mockHiraganaModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(kana),
      });

      mockUserModel.updateOne.mockResolvedValue({});

      const result = await service.updateHiragana({ symbol: 'あ' }, request);

      expect(mockUserModel.updateOne).toHaveBeenCalledTimes(2);

      expect(result).toEqual({
        message: 'あ - выучено',
        hiraganaId: '1',
      });
    });
  });
});
