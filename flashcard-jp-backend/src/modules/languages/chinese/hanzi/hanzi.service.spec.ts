import { Test, TestingModule } from '@nestjs/testing';
import { HanziService } from './hanzi.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Hanzi } from './hanzi.schema';
import { User } from '../../../user/user.schema';
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { HanziDto, UpdateHanziWeightDto } from './hanzi.schema.dto';

describe('HanziService', () => {
  let service: HanziService;
  let mockJwtService;
  let mockHanziModel;
  let mockUserModel;

  beforeEach(async () => {
    jest.resetAllMocks();

    mockJwtService = {
      verifyAsync: jest.fn(),
    };

    mockHanziModel = {
      create: jest.fn(),
      find: jest.fn(),
      deleteOne: jest.fn(),
      findOne: jest.fn(),
      countDocuments: jest.fn(),
    };

    mockUserModel = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HanziService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getModelToken(Hanzi.name),
          useValue: mockHanziModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<HanziService>(HanziService);
  });

  describe('validateAndGetPayload', () => {
    it('Ошибка без токена', async () => {
      const request = { cookies: {} };

      await expect(
        (service as any).validateAndGetPayload(request),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Ошибка невалидный токен', async () => {
      const request = { cookies: { session_flashcard: 'token' } } as Request;

      mockJwtService.verifyAsync.mockRejectedValue(new Error());

      await expect(
        (service as any).validateAndGetPayload(request),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Успешный токен', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ sub: 'user_id' });

      const request = {
        cookies: { session_flashcard: 'token' },
      } as Request;

      const result = await (service as any).validateAndGetPayload(request);

      expect(result).toEqual({ sub: 'user_id' });
    });
  });

  describe('hasActiveSubscription', () => {
    it('Возвращает false если подписки нет', () => {
      const result = (service as any).hasActiveSubscription({
        subscription: null,
      });

      expect(result).toBe(false);
    });

    it('Возвращает true если подписка активна', () => {
      const expiresAt = new Date();

      expiresAt.setDate(expiresAt.getDate() + 30);

      const result = (service as any).hasActiveSubscription({
        subscription: {
          expiresAt,
        },
      });

      expect(result).toBe(true);
    });

    it('Возвращает false если подписка истекла', () => {
      const expiresAt = new Date();

      expiresAt.setDate(expiresAt.getDate() - 1);

      const result = (service as any).hasActiveSubscription({
        subscription: {
          expiresAt,
        },
      });

      expect(result).toBe(false);
    });
  });

  describe('addHanzi', () => {
    it('Ошибка если пользователь не найден', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.addHanzi(
          {
            category: 'HSK1',
            hanzi: '日',
            translate: 'солнце',
            pinyin: 'rì',
          } as HanziDto,
          { cookies: {} } as Request,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('Успешное добавление ханзи', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'user_id',
          subscription: null,
        }),
      });

      mockHanziModel.countDocuments.mockResolvedValue(10);

      mockHanziModel.create.mockResolvedValue({});

      const result = await service.addHanzi(
        {
          category: 'HSK1',
          hanzi: '日',
          translate: 'солнце',
          pinyin: 'rì',
        } as HanziDto,
        { cookies: {} } as Request,
      );

      expect(mockHanziModel.countDocuments).toHaveBeenCalledWith({
        userId: 'user_id',
      });
      expect(mockHanziModel.create).toHaveBeenCalledWith({
        userId: 'user_id',
        category: 'HSK1',
        hanzi: '日',
        translate: 'солнце',
        pinyin: 'rì',
        weight: 1,
        srs: null,
      });
      expect(result).toEqual({
        data: '日 - добавлено',
      });
    });

    it('Ошибка если достигнут лимит бесплатной версии', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'user_id',
          subscription: null,
        }),
      });

      mockHanziModel.countDocuments.mockResolvedValue(82);

      await expect(
        service.addHanzi(
          {
            category: 'HSK1',
            hanzi: '日',
            translate: 'солнце',
            pinyin: 'rì',
          } as HanziDto,
          { cookies: {} } as Request,
        ),
      ).rejects.toThrow(ForbiddenException);
      expect(mockHanziModel.create).not.toHaveBeenCalled();
    });

    it('Пользователь с подпиской может добавлять ханзи без проверки лимита', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'user_id',
          subscription: {
            expiresAt,
          },
        }),
      });

      mockHanziModel.create.mockResolvedValue({});

      await service.addHanzi(
        {
          category: 'HSK1',
          hanzi: '日',
          translate: 'солнце',
          pinyin: 'rì',
        } as HanziDto,
        { cookies: {} } as Request,
      );
      expect(mockHanziModel.countDocuments).not.toHaveBeenCalled();
    });
  });

  describe('getHanzi', () => {
    it('Ошибка если пользователь не найден', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getHanzi({ cookies: {} } as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('Успешное получение ханзи', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'user_id' }),
      });

      const hanziList = [
        { _id: '1', hanzi: '日' },
        { _id: '2', hanzi: '月' },
      ];

      mockHanziModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(hanziList),
      });

      const result = await service.getHanzi({ cookies: {} } as any);

      expect(mockHanziModel.find).toHaveBeenCalledWith({
        userId: 'user_id',
      });

      expect(result).toEqual(hanziList);
    });
  });

  describe('deleteHanzi', () => {
    it('Ошибка если ханзи не найдено', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockHanziModel.deleteOne.mockResolvedValue({
        deletedCount: 0,
      });

      await expect(
        service.deleteHanzi('hanzi_id', { cookies: {} } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('Успешное удаление ханзи', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockHanziModel.deleteOne.mockResolvedValue({
        deletedCount: 1,
      });

      const result = await service.deleteHanzi('hanzi_id', {
        cookies: {},
      } as any);

      expect(mockHanziModel.deleteOne).toHaveBeenCalledWith({
        _id: 'hanzi_id',
        userId: 'user_id',
      });

      expect(result).toEqual({
        message: 'Ханзи удалено',
      });
    });
  });

  describe('getHanziCategory', () => {
    it('Ошибка если пользователь не найден', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.getHanziCategory({ cookies: {} } as Request),
      ).rejects.toThrow(NotFoundException);
    });

    it('Успешное получение категорий', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'user_id' }),
      });

      const hanziCategoryList = ['Машины', 'Еда'];

      mockHanziModel.distinct = jest.fn().mockResolvedValue(hanziCategoryList);

      const result = await service.getHanziCategory({ cookies: {} } as Request);

      expect(mockHanziModel.distinct).toHaveBeenCalledWith('category', {
        userId: 'user_id',
      });
      expect(result).toEqual(hanziCategoryList);
    });
  });

  describe('updateHanziWeight', () => {
    it('Ошибка если пользователь не найден', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateHanziWeight(
          {
            hanziId: '123',
            status: 'remember',
          } as UpdateHanziWeightDto,
          { cookies: {} } as Request,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('Ошибка если ханзи не найдено', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'user_id',
        }),
      });

      mockHanziModel.findOne.mockResolvedValue(null);

      await expect(
        service.updateHanziWeight(
          {
            hanziId: '123',
            status: 'remember',
          } as UpdateHanziWeightDto,
          { cookies: {} } as Request,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('Уменьшает вес при remember', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'user_id',
        }),
      });

      const hanzi = {
        _id: '123',
        hanzi: '日',
        weight: 3,
        save: jest.fn(),
      };

      mockHanziModel.findOne.mockResolvedValue(hanzi);

      const result = await service.updateHanziWeight(
        {
          hanziId: '123',
          status: 'remember',
        } as UpdateHanziWeightDto,
        { cookies: {} } as Request,
      );

      expect(hanzi.weight).toBe(2);
      expect(hanzi.save).toHaveBeenCalled();
      expect(result).toEqual({
        message: '日 - вес изменен',
      });
    });

    it('Увеличивает вес при forgot', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'user_id',
        }),
      });

      const hanzi = {
        _id: '123',
        hanzi: '月',
        weight: 2,
        save: jest.fn(),
      };

      mockHanziModel.findOne.mockResolvedValue(hanzi);

      const result = await service.updateHanziWeight(
        {
          hanziId: '123',
          status: 'forgot',
        } as UpdateHanziWeightDto,
        { cookies: {} } as Request,
      );

      expect(hanzi.weight).toBe(3);
      expect(hanzi.save).toHaveBeenCalled();
      expect(result).toEqual({
        message: '月 - вес изменен',
      });
    });
  });
});
