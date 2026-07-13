import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { WordCnController } from './wordsCn.controller';
import { WordCnService } from './wordsCn.service';
import { UpdateWordCnWeightDto, WordCnDto } from './wordsCn.schema.dto';

describe('WordCnController', () => {
  let controller: WordCnController;
  let mockWordsCnService;

  beforeEach(async () => {
    jest.resetAllMocks();

    mockWordsCnService = {
      addWord: jest.fn(),
      getWord: jest.fn(),
      deleteWord: jest.fn(),
      getWordsCategory: jest.fn(),
      updateWordWeight: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WordCnController],
      providers: [
        {
          provide: WordCnService,
          useValue: mockWordsCnService,
        },
      ],
    }).compile();

    controller = module.get<WordCnController>(WordCnController);
  });

  describe('addWord', () => {
    it('Добавление слова', async () => {
      const request = {
        cookies: { session_flashcard: 'token' },
      } as Request;

      const dto: WordCnDto = {
        _id: '1',
        word: '你好',
        pinyin: 'nǐ hǎo',
        translate: 'привет',
        category: 'greeting',
        weight: 1,
        srs: {},
      };

      const response = {
        data: '你好 - добавлено',
      };

      mockWordsCnService.addWord.mockResolvedValue(response);

      const result = await controller.addWord(request, dto);

      expect(mockWordsCnService.addWord).toHaveBeenCalledWith(request, dto);
      expect(result).toEqual(response);
    });
  });

  describe('getWord', () => {
    it('Получение слов пользователя', async () => {
      const request = {
        cookies: { session_flashcard: 'token' },
      } as Request;

      const response = [
        {
          _id: '1',
          word: '你好',
          pinyin: 'nǐ hǎo',
          translate: 'привет',
          category: 'greeting',
          weight: 1,
          srs: {},
        },
      ];

      mockWordsCnService.getWord.mockResolvedValue(response);

      const result = await controller.getWord(request);

      expect(mockWordsCnService.getWord).toHaveBeenCalledWith(request);
      expect(result).toEqual(response);
    });
  });

  describe('deleteWord', () => {
    it('Удаление слова по id', async () => {
      const request = {
        cookies: { session_flashcard: 'token' },
      } as Request;

      const wordId = 'abc123';

      const response = {
        message: 'Слово удалено',
      };

      mockWordsCnService.deleteWord.mockResolvedValue(response);

      const result = await controller.deleteWord(request, wordId);

      expect(mockWordsCnService.deleteWord).toHaveBeenCalledWith(
        request,
        wordId,
      );
      expect(result).toEqual(response);
    });
  });

  describe('getWordsCategory', () => {
    it('Получение категорий слов пользователя', async () => {
      const request = {
        cookies: { session_flashcard: 'token' },
      } as Request;

      const response = ['Машины', 'Пища'];

      mockWordsCnService.getWordsCategory.mockResolvedValue(response);

      const result = await controller.getWordsCategory(request);

      expect(mockWordsCnService.getWordsCategory).toHaveBeenCalledWith(request);
      expect(result).toEqual(response);
      expect(mockWordsCnService.getWordsCategory).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateWordWeight', () => {
    it('Изменение веса слова', async () => {
      const request = {
        cookies: { session_flashcard: 'token' },
      } as Request;

      const dto: UpdateWordCnWeightDto = {
        wordId: '1',
        status: 'remember',
      };

      const response = {
        message: '你好 - вес изменен',
      };

      mockWordsCnService.updateWordWeight.mockResolvedValue(response);

      const result = await controller.updateWordWeight(dto, request);

      expect(mockWordsCnService.updateWordWeight).toHaveBeenCalledWith(
        request,
        dto,
      );
      expect(result).toEqual(response);
    });
  });
});
