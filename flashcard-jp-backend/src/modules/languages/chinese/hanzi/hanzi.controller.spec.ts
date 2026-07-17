import { Test, TestingModule } from '@nestjs/testing';
import { HanziController } from './hanzi.controller';
import { HanziService } from './hanzi.service';
import { Request } from 'express';
import { HanziDto, UpdateHanziWeightDto } from './hanzi.schema.dto';

describe('HanziController', () => {
  let controller: HanziController;
  let mockHanziService;

  beforeEach(async () => {
    jest.resetAllMocks();

    mockHanziService = {
      addHanzi: jest.fn(),
      getHanzi: jest.fn(),
      deleteHanzi: jest.fn(),
      getHanziCategory: jest.fn(),
      updateHanziWeight: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HanziController],
      providers: [
        {
          provide: HanziService,
          useValue: mockHanziService,
        },
      ],
    }).compile();

    controller = module.get<HanziController>(HanziController);
  });

  describe('addHanzi', () => {
    it('Добавление ханзи', async () => {
      const request = {
        cookies: { session_flashcard: 'token' },
      } as Request;

      const dto: HanziDto = {
        _id: '1',
        category: 'HSK1',
        hanzi: '日',
        translate: 'солнце',
        pinyin: 'rì',
        weight: 1,
        srs: {},
      };

      const response = {
        data: '日 - добавлено',
      };

      mockHanziService.addHanzi.mockResolvedValue(response);

      const result = await controller.addHanzi(request, dto);

      expect(mockHanziService.addHanzi).toHaveBeenCalledWith(dto, request);
      expect(result).toEqual(response);
    });
  });

  describe('getHanzi', () => {
    it('Получение ханзи пользователя', async () => {
      const request = {
        cookies: { session_flashcard: 'token' },
      } as Request;

      const response: HanziDto[] = [
        {
          _id: '1',
          category: 'HSK1',
          hanzi: '日',
          translate: 'солнце',
          pinyin: 'rì',
          weight: 1,
          srs: {},
        },
      ];

      mockHanziService.getHanzi.mockResolvedValue(response);

      const result = await controller.getHanzi(request);

      expect(mockHanziService.getHanzi).toHaveBeenCalledWith(request);
      expect(result).toEqual(response);
    });
  });

  describe('deleteHanzi', () => {
    it('Удаление ханзи по id', async () => {
      const request = {
        cookies: { session_flashcard: 'token' },
      } as Request;

      const hanziId = 'abc123';

      const response = {
        message: 'Ханзи удалено',
      };

      mockHanziService.deleteHanzi.mockResolvedValue(response);

      const result = await controller.deleteHanzi(request, hanziId);

      expect(mockHanziService.deleteHanzi).toHaveBeenCalledWith(
        hanziId,
        request,
      );
      expect(result).toEqual(response);
    });
  });

  describe('getHanziCategory', () => {
    it('Получение категорий ханзи пользователя', async () => {
      const request = {
        cookies: { session_flashcard: 'token' },
      } as Request;

      const response = ['Машины', 'Пища'];

      mockHanziService.getHanziCategory.mockResolvedValue(response);

      const result = await controller.getHanziCategory(request);

      expect(mockHanziService.getHanziCategory).toHaveBeenCalledWith(request);
      expect(result).toEqual(response);
      expect(mockHanziService.getHanziCategory).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateHanziWeight', () => {
    it('Изменение веса ханзи', async () => {
      const request = {
        cookies: { session_flashcard: 'token' },
      } as Request;

      const dto: UpdateHanziWeightDto = {
        hanziId: '123',
        status: 'remember',
      };

      const response = {
        message: '日 - выучил',
        hanziId: '123',
      };

      mockHanziService.updateHanziWeight.mockResolvedValue(response);

      const result = await controller.updateHanziWeight(dto, request);

      expect(mockHanziService.updateHanziWeight).toHaveBeenCalledWith(
        dto,
        request,
      );
      expect(result).toEqual(response);
    });
  });
});
