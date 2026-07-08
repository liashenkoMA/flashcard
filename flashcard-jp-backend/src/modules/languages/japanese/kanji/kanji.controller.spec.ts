import { Test, TestingModule } from '@nestjs/testing';
import { KanjiController } from './kanji.controller';
import { KanjiService } from './kanji.service';
import { KanjiDto, UpdateKanjiWeightDto } from './kanji.schema.dto';
import { Request } from 'express';

describe('KanjiController', () => {
  let controller: KanjiController;
  let mockKanjiService: any;

  beforeEach(async () => {
    jest.resetAllMocks();

    mockKanjiService = {
      addKanji: jest.fn(),
      getKanji: jest.fn(),
      deleteKanji: jest.fn(),
      updateKanjiWeight: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [KanjiController],
      providers: [
        {
          provide: KanjiService,
          useValue: mockKanjiService,
        },
      ],
    }).compile();

    controller = module.get<KanjiController>(KanjiController);
  });

  describe('addKanji', () => {
    it('Добавление кандзи', async () => {
      const request = {
        cookies: { session_flashcard: 'token' },
      } as Request;

      const dto: KanjiDto = {
        _id: '1',
        level: 'N5',
        kanji: '日',
        translate: 'солнце',
        jpRead: 'にち',
        chinaRead: 'ri',
        weight: 1,
      };

      const response = {
        data: '日 - добавлено',
      };

      mockKanjiService.addKanji.mockResolvedValue(response);

      const result = await controller.addKanji(request, dto);

      expect(mockKanjiService.addKanji).toHaveBeenCalledWith(dto, request);
      expect(result).toEqual(response);
    });
  });

  describe('getKanji', () => {
    it('Получение кандзи пользователя', async () => {
      const request = {
        cookies: { session_flashcard: 'token' },
      } as Request;

      const response = [
        {
          _id: '1',
          kanji: '日',
          level: 'N5',
          translate: 'солнце',
          jpRead: 'にち',
          chinaRead: 'ri',
        },
      ];

      mockKanjiService.getKanji.mockResolvedValue(response);

      const result = await controller.getKanji(request);

      expect(mockKanjiService.getKanji).toHaveBeenCalledWith(request);
      expect(result).toEqual(response);
    });
  });

  describe('deleteKanji', () => {
    it('Удаление кандзи по id', async () => {
      const request = {
        cookies: { session_flashcard: 'token' },
      } as Request;

      const kanjiId = 'abc123';

      const response = {
        message: 'Кандзи удалено',
      };

      mockKanjiService.deleteKanji.mockResolvedValue(response);

      const result = await controller.deleteKanji(request, kanjiId);

      expect(mockKanjiService.deleteKanji).toHaveBeenCalledWith(
        kanjiId,
        request,
      );

      expect(result).toEqual(response);
    });
  });

  describe('updateKanjiWeight', () => {
    it('Изменение веса кандзи', async () => {
      const request = {
        cookies: { session_flashcard: 'token' },
      } as Request;

      const dto: UpdateKanjiWeightDto = {
        kanjiId: '123',
        status: 'remember',
      };

      const response = {
        message: '日 - выучил',
        kanjiId: '123',
      };

      mockKanjiService.updateKanjiWeight.mockResolvedValue(response);

      const result = await controller.updateKanjiWeight(dto, request);

      expect(mockKanjiService.updateKanjiWeight).toHaveBeenCalledWith(
        dto,
        request,
      );
      expect(result).toEqual(response);
    });
  });
});
