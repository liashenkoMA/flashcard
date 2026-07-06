import { Test, TestingModule } from '@nestjs/testing';
import { WordsService } from './words.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { WordJp } from './words.schema';
import { User } from '../../../user/user.schema';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('WordsService', () => {
  let service: WordsService;
  let mockJwtService: any;
  let mockWordModel: any;
  let mockUserModel: any;

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
    };

    mockUserModel = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WordsService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getModelToken(WordJp.name),
          useValue: mockWordModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<WordsService>(WordsService);
  });

  describe('validateAndGetPayload', () => {
    it('Ошибка без токена', async () => {
      const request = { cookies: {} };

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
      } as any;

      const result = await (service as any).validateAndGetPayload(request);

      expect(result).toEqual({ sub: 'user_id' });
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
          {
            word: 'hello',
            translate: 'привет',
            category: 'greeting',
          } as any,
          { cookies: {} } as any,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('Успешное добавление слова', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'user_id' }),
      });

      mockWordModel.create.mockResolvedValue({});

      const result = await service.addWord(
        {
          word: 'hello',
          translate: 'привет',
          category: 'greeting',
        } as any,
        { cookies: {} } as any,
      );

      expect(mockWordModel.create).toHaveBeenCalledWith({
        userId: 'user_id',
        word: 'hello',
        translate: 'привет',
        category: 'greeting',
        weight: 1,
        srs: null,
      });

      expect(result).toEqual({
        data: 'hello - добавлено',
      });
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

      await expect(service.getWord({ cookies: {} } as any)).rejects.toThrow(
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

      const result = await service.getWord({ cookies: {} } as any);

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
        service.deleteWord('word_id', { cookies: {} } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('Успешное удаление слова', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockWordModel.deleteOne.mockResolvedValue({
        deletedCount: 1,
      });

      const result = await service.deleteWord('word_id', {
        cookies: {},
      } as any);

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
        service.getWordsCategory({ cookies: {} } as any),
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

      const result = await service.getWordsCategory({ cookies: {} } as any);

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
          {
            wordId: '1',
            status: 'remember',
          } as any,
          { cookies: {} } as any,
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
          {
            wordId: 'word_id',
            status: 'remember',
          } as any,
          { cookies: {} } as any,
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
        {
          wordId: '1',
          status: 'remember',
        } as any,
        { cookies: {} } as any,
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
        {
          wordId: '1',
          status: 'forgot',
        } as any,
        { cookies: {} } as any,
      );

      expect(word.weight).toBe(3);
      expect(word.save).toHaveBeenCalled();
    });
  });
});
