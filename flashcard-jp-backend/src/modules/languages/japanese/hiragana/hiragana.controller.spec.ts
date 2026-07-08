import { Test, TestingModule } from '@nestjs/testing';
import { HiraganaController } from './hiragana.controller';
import { HiraganaService } from './hiragana.service';
import {
  UpdateHiraganaDto,
  UpdateHiraganaWeightDto,
} from './hiragana.schema.dto';
import { Request } from 'express';

describe('HiraganaController', () => {
  let controller: HiraganaController;
  let mockHiraganaService;

  beforeEach(async () => {
    mockHiraganaService = {
      getHiragana: jest.fn(),
      updateHiragana: jest.fn(),
      updateHiraganaWeight: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HiraganaController],
      providers: [
        {
          provide: HiraganaService,
          useValue: mockHiraganaService,
        },
      ],
    }).compile();

    controller = module.get<HiraganaController>(HiraganaController);
  });

  it('getHiragana', async () => {
    const request = {
      cookies: { session_flashcard: 'token' },
    } as Request;

    const response = [
      { _id: '1', symbol: 'あ', learned: true },
      { _id: '2', symbol: 'い', learned: false },
    ];

    mockHiraganaService.getHiragana.mockResolvedValue(response);

    const result = await controller.getHiragana(request);

    expect(mockHiraganaService.getHiragana).toHaveBeenCalledWith(request);
    expect(result).toEqual(response);
  });

  it('updateHiragana', async () => {
    const request = {
      cookies: { session_flashcard: 'token' },
    } as Request;

    const dto: UpdateHiraganaDto = {
      symbol: 'あ',
    };

    const response = {
      message: 'あ - выучено',
      hiraganaId: '1',
    };

    mockHiraganaService.updateHiragana.mockResolvedValue(response);

    const result = await controller.updateHiragana(dto, request);

    expect(mockHiraganaService.updateHiragana).toHaveBeenCalledWith(
      dto,
      request,
    );
    expect(result).toEqual(response);
  });

  it('updateHiraganaWeight', async () => {
    const request = {
      cookies: { session_flashcard: 'token' },
    } as Request;

    const dto: UpdateHiraganaWeightDto = {
      symbol: 'あ',
      status: 'remember',
    };

    const response = {
      message: 'Вес хираганы обновлен',
      hiraganaId: '1',
    };

    mockHiraganaService.updateHiraganaWeight.mockResolvedValue(response);

    const result = await controller.updateHiraganaWeight(dto, request);

    expect(mockHiraganaService.updateHiraganaWeight).toHaveBeenCalledWith(
      dto,
      request,
    );
    expect(result).toEqual(response);
  });
});
