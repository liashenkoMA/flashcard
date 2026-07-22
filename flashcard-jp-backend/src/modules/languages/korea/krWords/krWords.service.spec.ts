import { Test, TestingModule } from '@nestjs/testing';
import { WordsKrService } from './krWords.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { WordKr } from './krWords.schema';
import { User } from '../../../user/user.schema';
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UpdateWordKrWeightDto, WordKrDto } from './krWords.schema.dto';

describe('WordsKrService', () => {
  let service: WordsKrService;
  let mockJwtService;
  let mockWordModel;
  let mockUserModel;

  beforeEach(async () => {
    jest.resetAllMocks();

    mockJwtService = {
      verifyAsync: jest.fn(),
    };

    mockWordModel = {
      create: jest.fn(),
      find: jest.fn(),
      deleteOne: jest.fn(),
      distinct: jest.fn(),
      findOne: jest.fn(),
      countDocuments: jest.fn(),
    };

    mockUserModel = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WordsKrService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getModelToken(WordKr.name),
          useValue: mockWordModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<WordsKrService>(WordsKrService);
  });

  describe('validateAndGetPayload', () => {
    it('Ошибка без токена', async () => {
      const request = { cookies: {} } as Request;

      await expect(
        (service as any).validateAndGetPayload(request),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Ошибка невалидный токен', async () => {
      const request = { cookies: { session_flashcard: 'token' } };

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

  describe('addWord', () => {
    it('Ошибка если пользователь не найден', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.addWord(
          { cookies: {} } as Request,
          {
            word: '안녕하세요',
            translate: 'привет',
            category: 'greeting',
          } as WordKrDto,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('Успешное добавление слова', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'user_id',
          subscription: null,
        }),
      });

      mockWordModel.countDocuments.mockResolvedValue(10);

      mockWordModel.create.mockResolvedValue({});

      const result = await service.addWord(
        { cookies: {} } as Request,
        {
          word: '안녕하세요',
          translate: 'привет',
          category: 'greeting',
        } as WordKrDto,
      );

      expect(mockWordModel.countDocuments).toHaveBeenCalledWith({
        userId: 'user_id',
      });
      expect(mockWordModel.create).toHaveBeenCalledWith({
        userId: 'user_id',
        word: '안녕하세요',
        translate: 'привет',
        category: 'greeting',
        weight: 1,
        srs: null,
      });
      expect(result).toEqual({
        data: '안녕하세요 - добавлено',
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

      mockWordModel.countDocuments.mockResolvedValue(100);

      await expect(
        service.addWord(
          { cookies: {} } as Request,
          {
            word: '안녕하세요',
            translate: 'привет',
            category: 'greeting',
          } as WordKrDto,
        ),
      ).rejects.toThrow(ForbiddenException);
      expect(mockWordModel.create).not.toHaveBeenCalled();
    });

    it('Пользователь с подпиской может добавлять слова без проверки лимита', async () => {
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

      mockWordModel.create.mockResolvedValue({});

      await service.addWord(
        { cookies: {} } as Request,
        {
          word: '안녕하세요',
          translate: 'привет',
          category: 'greeting',
        } as WordKrDto,
      );

      expect(mockWordModel.countDocuments).not.toHaveBeenCalled();
    });
  });

  describe('getWord', () => {
    it('Ошибка если пользователь не найден', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getWord({ cookies: {} } as Request)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('Успешное получение слов', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'user_id' }),
      });

      const wordsList = [
        { _id: '1', word: 'hello' },
        { _id: '2', word: 'world' },
      ];

      mockWordModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(wordsList),
      });

      const result = await service.getWord({ cookies: {} } as Request);

      expect(mockWordModel.find).toHaveBeenCalledWith({
        userId: 'user_id',
      });

      expect(result).toEqual(wordsList);
    });
  });

  describe('deleteWord', () => {
    it('Ошибка если слово не найдено', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockWordModel.deleteOne.mockResolvedValue({
        deletedCount: 0,
      });

      await expect(
        service.deleteWord({ cookies: {} } as Request, 'word_id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('Успешное удаление слова', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockWordModel.deleteOne.mockResolvedValue({
        deletedCount: 1,
      });

      const result = await service.deleteWord(
        { cookies: {} } as Request,
        'word_id',
      );

      expect(mockWordModel.deleteOne).toHaveBeenCalledWith({
        _id: 'word_id',
        userId: 'user_id',
      });

      expect(result).toEqual({
        message: 'Слово удалено',
      });
    });
  });

  describe('getWordsCategory', () => {
    it('Ошибка если пользователь не найден', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.getWordsCategory({ cookies: {} } as Request),
      ).rejects.toThrow(NotFoundException);
    });

    it('Успешное получение категорий', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'user_id' }),
      });

      const wordsCategoryList = ['Машины', 'Еда'];

      mockWordModel.distinct = jest.fn().mockResolvedValue(wordsCategoryList);

      const result = await service.getWordsCategory({ cookies: {} } as Request);

      expect(mockWordModel.distinct).toHaveBeenCalledWith('category', {
        userId: 'user_id',
      });

      expect(result).toEqual(wordsCategoryList);
    });
  });

  describe('updateWordWeight', () => {
    it('Ошибка если пользователь не найден', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateWordWeight(
          { cookies: {} } as Request,
          {
            wordId: '1',
            status: 'remember',
          } as UpdateWordKrWeightDto,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('Ошибка если слово не найдено', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'user_id',
        }),
      });

      mockWordModel.findOne.mockResolvedValue(null);

      await expect(
        service.updateWordWeight(
          { cookies: {} } as Request,
          {
            wordId: 'word_id',
            status: 'remember',
          } as UpdateWordKrWeightDto,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('Уменьшает вес если remember', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'user_id',
        }),
      });

      const word = {
        _id: '1',
        word: 'hello',
        weight: 3,
        save: jest.fn(),
      };

      mockWordModel.findOne.mockResolvedValue(word);

      const result = await service.updateWordWeight(
        { cookies: {} } as Request,
        {
          wordId: '1',
          status: 'remember',
        } as UpdateWordKrWeightDto,
      );

      expect(word.weight).toBe(2);
      expect(word.save).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'hello - вес изменен',
      });
    });

    it('Увеличивает вес если forgot', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'user_id',
        }),
      });

      const word = {
        _id: '1',
        word: 'hello',
        weight: 2,
        save: jest.fn(),
      };

      mockWordModel.findOne.mockResolvedValue(word);

      await service.updateWordWeight(
        { cookies: {} } as Request,
        {
          wordId: '1',
          status: 'forgot',
        } as UpdateWordKrWeightDto,
      );

      expect(word.weight).toBe(3);
      expect(word.save).toHaveBeenCalled();
    });
  });
});
