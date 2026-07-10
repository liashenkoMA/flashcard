import { Test, TestingModule } from '@nestjs/testing';
import { WordsKrController } from './krWords.controller';
import { WordsKrService } from './krWords.service';
import { UpdateWordKrWeightDto, WordKrDto } from './krWords.schema.dto';
import { Request } from 'express';

describe('WordsKrController', () => {
  let controller: WordsKrController;
  let mockWordsKrService;

  beforeEach(async () => {
    jest.resetAllMocks();

    mockWordsKrService = {
      addWord: jest.fn(),
      getWord: jest.fn(),
      deleteWord: jest.fn(),
      getWordsCategory: jest.fn(),
      updateWordWeight: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WordsKrController],
      providers: [
        {
          provide: WordsKrService,
          useValue: mockWordsKrService,
        },
      ],
    }).compile();

    controller = module.get<WordsKrController>(WordsKrController);
  });

  describe('addWord', () => {
    it('Добавление слова', async () => {
      const request = {
        cookies: { session_flashcard: 'token' },
      } as Request;

      const dto: WordKrDto = {
        _id: '1',
        word: '안녕',
        translate: 'привет',
        category: 'greeting',
        weight: 1,
        srs: {},
      };

      const response = {
        data: '안녕 - добавлено',
      };

      mockWordsKrService.addWord.mockResolvedValue(response);

      const result = await controller.addWord(request, dto);

      expect(mockWordsKrService.addWord).toHaveBeenCalledWith(request, dto);
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
          word: '안녕',
          translate: 'привет',
          category: 'greeting',
          weight: 1,
          srs: {},
        },
      ];

      mockWordsKrService.getWord.mockResolvedValue(response);

      const result = await controller.getWord(request);

      expect(mockWordsKrService.getWord).toHaveBeenCalledWith(request);
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

      mockWordsKrService.deleteWord.mockResolvedValue(response);

      const result = await controller.deleteWord(request, wordId);

      expect(mockWordsKrService.deleteWord).toHaveBeenCalledWith(
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

      mockWordsKrService.getWordsCategory.mockResolvedValue(response);

      const result = await controller.getWordsCategory(request);

      expect(mockWordsKrService.getWordsCategory).toHaveBeenCalledWith(request);
      expect(result).toEqual(response);
      expect(mockWordsKrService.getWordsCategory).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateWordWeight', () => {
    it('Изменение веса слова', async () => {
      const request = {
        cookies: { session_flashcard: 'token' },
      } as Request;

      const dto: UpdateWordKrWeightDto = {
        wordId: '1',
        status: 'remember',
      };

      const response = {
        message: '안녕 - вес изменен',
      };

      mockWordsKrService.updateWordWeight.mockResolvedValue(response);

      const result = await controller.updateWordWeight(dto, request);

      expect(mockWordsKrService.updateWordWeight).toHaveBeenCalledWith(
        request,
        dto,
      );
      expect(result).toEqual(response);
    });
  });
});
