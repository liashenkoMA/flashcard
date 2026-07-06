import { Test, TestingModule } from '@nestjs/testing';
import { WordsController } from './words.controller';
import { WordsService } from './words.service';
import { UpdateWordJpWeightDto, WordJpDto } from './words.schema.dto';

describe('WordsController', () => {
  let controller: WordsController;
  let mockWordsService: any;

  beforeEach(async () => {
    jest.resetAllMocks();

    mockWordsService = {
      addWord: jest.fn(),
      getWord: jest.fn(),
      deleteWord: jest.fn(),
      getWordsCategory: jest.fn(),
      updateWordWeight: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WordsController],
      providers: [
        {
          provide: WordsService,
          useValue: mockWordsService,
        },
      ],
    }).compile();

    controller = module.get<WordsController>(WordsController);
  });

  describe('addWord', () => {
    it('Добавление слова', async () => {
      const request = {
        cookies: { session_flashcard: 'token' },
      } as any;

      const dto: WordJpDto = {
        _id: '1',
        word: 'hello',
        translate: 'привет',
        category: 'greeting',
        weight: 1,
        srs: {},
      };

      const response = {
        data: 'hello - добавлено',
      };

      mockWordsService.addWord.mockResolvedValue(response);

      const result = await controller.addWord(request, dto);

      expect(mockWordsService.addWord).toHaveBeenCalledWith(dto, request);
      expect(result).toEqual(response);
    });
  });

  describe('getWord', () => {
    it('Получение слов пользователя', async () => {
      const request = {
        cookies: { session_flashcard: 'token' },
      } as any;

      const response = [
        {
          _id: '1',
          word: 'hello',
          translate: 'привет',
          category: 'greeting',
          weight: 1,
          srs: {},
        },
      ];

      mockWordsService.getWord.mockResolvedValue(response);

      const result = await controller.getWord(request);

      expect(mockWordsService.getWord).toHaveBeenCalledWith(request);
      expect(result).toEqual(response);
    });
  });

  describe('deleteWord', () => {
    it('Удаление слова по id', async () => {
      const request = {
        cookies: { session_flashcard: 'token' },
      } as any;

      const wordId = 'abc123';

      const response = {
        message: 'Слово удалено',
      };

      mockWordsService.deleteWord.mockResolvedValue(response);

      const result = await controller.deleteWord(request, wordId);

      expect(mockWordsService.deleteWord).toHaveBeenCalledWith(wordId, request);
      expect(result).toEqual(response);
    });
  });

  describe('getWordsCategory', () => {
    it('Получение категорий слов пользователя', async () => {
      const request = {
        cookies: { session_flashcard: 'token' },
      } as any;

      const response = ['Машины', 'Пища'];

      mockWordsService.getWordsCategory.mockResolvedValue(response);

      const result = await controller.getWordsCategory(request);

      expect(mockWordsService.getWordsCategory).toHaveBeenCalledWith(request);
      expect(result).toEqual(response);
      expect(mockWordsService.getWordsCategory).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateWordWeight', () => {
    it('Изменение веса слова', async () => {
      const request = {
        cookies: { session_flashcard: 'token' },
      } as any;

      const dto: UpdateWordJpWeightDto = {
        wordId: '1',
        status: 'remember',
      };

      const response = {
        message: 'arigatou - вес изменен',
      };

      mockWordsService.updateWordWeight.mockResolvedValue(response);

      const result = await controller.updateWordWeight(dto, request);

      expect(mockWordsService.updateWordWeight).toHaveBeenCalledWith(
        dto,
        request,
      );
      expect(result).toEqual(response);
    });
  });
});
