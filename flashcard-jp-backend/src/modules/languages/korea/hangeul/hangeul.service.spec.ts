import { Test, TestingModule } from '@nestjs/testing';
import { HangeulService } from './hangeul.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Hangeul } from './hangeul.schema';
import { User } from '../../../user/user.schema';
import { Request } from 'express';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateHangeulWeightDto } from './hangeul.schema.dto';

describe('HangeulService', () => {
  let mockJwtService;
  let mockHangeulModel;
  let mockUserModel;
  let service: HangeulService;

  beforeEach(async () => {
    jest.resetAllMocks();

    mockJwtService = {
      verifyAsync: jest.fn(),
    };

    mockUserModel = {
      findById: jest.fn(),
      updateOne: jest.fn(),
    };

    mockHangeulModel = {
      find: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HangeulService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getModelToken(Hangeul.name),
          useValue: mockHangeulModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<HangeulService>(HangeulService);
  });

  describe('validateAndGetPayload', () => {
    it('Ошибка пользователь не авторизован', async () => {
      const request = { cookies: {} } as Request;

      await expect(
        (service as any).validateAndGetPayload(request),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Ошибка невалидный токен', async () => {
      const request = { cookies: { session_flashcard: '1234' } } as Request;

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
      } as Request;

      const result = await (service as any).validateAndGetPayload(request);

      expect(result).toEqual(payload);
    });
  });

  describe('getHangeul', () => {
    it('Ошибка пользователя не существует', async () => {
      const request = {
        cookies: { session_flashcard: 'valid_token' },
      } as Request;

      jest
        .spyOn(service as any, 'validateAndGetPayload')
        .mockResolvedValue({ sub: 'user_id' });

      mockUserModel.findById.mockReturnValue({
        select: jest
          .fn()
          .mockReturnValue({ lean: jest.fn().mockResolvedValue(null) }),
      });

      await expect(service.getHangeul(request)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('Успешное получение хангел', async () => {
      const request = {} as Request;

      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      const mockUser = {
        learningProgress: [
          {
            language: 'kr',
            hangul: [{ id: '1', weight: 3 }],
          },
        ],
      };

      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockUser),
        }),
      });

      const mockHangul = [
        { _id: '1', symbol: 'ㄱ' },
        { _id: '2', symbol: 'ㄴ' },
      ];

      mockHangeulModel.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockHangul),
      });

      const result = await service.getHangeul(request);

      expect(result).toEqual([
        { _id: '1', symbol: 'ㄱ', weight: 3, learned: true },
        { _id: '2', symbol: 'ㄴ', weight: 0, learned: false },
      ]);
    });
  });

  describe('updateHangeul', () => {
    it('Ошибка пользователя не существует', async () => {
      const request = {
        cookies: { session_flashcard: 'valid_token' },
      } as Request;

      jest
        .spyOn(service as any, 'validateAndGetPayload')
        .mockResolvedValue({ sub: 'user_id' });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateHangeul(request, { symbol: 'ㄱ' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('Ошибка хангел не найдена', async () => {
      const request = {} as Request;

      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          learningProgress: [],
        }),
      });

      mockHangeulModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateHangeul(request, { symbol: 'ㄱ' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('toggle add/remove', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      const user = {
        learningProgress: [
          {
            language: 'kr',
            hangul: [],
          },
        ],
        save: jest.fn(),
      };

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      mockHangeulModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: '1',
          symbol: 'ㄱ',
        }),
      });

      const result = await service.updateHangeul({} as Request, {
        symbol: 'ㄱ',
      });

      expect(user.save).toHaveBeenCalled();
      expect(result).toHaveProperty('learned');
      expect(result.hangeulId).toBe('1');
    });
  });

  describe('updateHangeulWeight', () => {
    it('Ошибка пользователя не существует', async () => {
      const request = {
        cookies: { session_flashcard: 'valid_token' },
      } as Request;

      jest
        .spyOn(service as any, 'validateAndGetPayload')
        .mockResolvedValue({ sub: 'user_id' });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateHangeulWeight(request, {
          symbol: 'ㄱ',
          status: 'remember',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('Ошибка хангел не найдена', async () => {
      const request = {} as Request;

      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          learningProgress: [
            {
              language: 'jp',
              hangul: [
                {
                  id: '1',
                  weight: 2,
                },
              ],
            },
          ],
        }),
      });

      mockHangeulModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateHangeulWeight(request, {
          symbol: 'ㄱ',
          status: 'remember',
        } as UpdateHangeulWeightDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('Уменьшает вес если статус remember', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      const user = {
        learningProgress: [
          {
            language: 'kr',
            hangul: [
              {
                id: '1',
                weight: 3,
              },
            ],
          },
        ],
        save: jest.fn(),
      };

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      mockHangeulModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: '1',
          symbol: 'ㄴ',
        }),
      });

      const result = await service.updateHangeulWeight(
        {} as Request,
        {
          symbol: 'ㄴ',
          status: 'remember',
        } as UpdateHangeulWeightDto,
      );

      expect(user.learningProgress[0].hangul[0].weight).toBe(2);
      expect(user.save).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'ㄴ - выучил',
        hangeulId: '1',
      });
    });

    it('Увеличивает вес если статус forgot', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      const user = {
        learningProgress: [
          {
            language: 'kr',
            hangul: [
              {
                id: '1',
                weight: 2,
              },
            ],
          },
        ],
        save: jest.fn(),
      };

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      mockHangeulModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: '1',
          symbol: 'ㄴ',
        }),
      });

      const result = await service.updateHangeulWeight(
        {} as Request,
        {
          symbol: 'ㄴ',
          status: 'forgot',
        } as UpdateHangeulWeightDto,
      );

      expect(user.learningProgress[0].hangul[0].weight).toBe(3);
      expect(user.save).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'ㄴ - забыл',
        hangeulId: '1',
      });
    });
  });
});
