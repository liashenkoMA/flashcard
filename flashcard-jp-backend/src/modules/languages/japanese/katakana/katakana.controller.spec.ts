import { Test, TestingModule } from '@nestjs/testing';
import { KatakanaController } from './katakana.controller';
import { KatakanaService } from './katakana.service';
import {
  UpdateKatakanaDto,
  UpdateKatakanaWeightDto,
} from './katakana.schema.dto';
import { Request } from 'express';

describe('KatakanaController', () => {
  let controller: KatakanaController;
  let mockKatakanaService;

  beforeEach(async () => {
    mockKatakanaService = {
      getKatakana: jest.fn(),
      updateKatakana: jest.fn(),
      updateKatakanaWeight: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [KatakanaController],
      providers: [
        {
          provide: KatakanaService,
          useValue: mockKatakanaService,
        },
      ],
    }).compile();

    controller = module.get<KatakanaController>(KatakanaController);
  });

  it('getKatakana', async () => {
    const request = {
      cookies: { session_flashcard: 'token' },
    } as Request;

    const response = [
      { _id: '1', symbol: 'ア', learned: true },
      { _id: '2', symbol: 'イ', learned: false },
    ];

    mockKatakanaService.getKatakana.mockResolvedValue(response);

    const result = await controller.getKatakana(request);

    expect(mockKatakanaService.getKatakana).toHaveBeenCalledWith(request);
    expect(result).toEqual(response);
  });

  it('updateKatakana', async () => {
    const request = {
      cookies: { session_flashcard: 'token' },
    } as Request;

    const dto: UpdateKatakanaDto = {
      symbol: 'ア',
    };

    const response = {
      message: 'ア - выучено',
      katakanaId: '1',
      learned: true,
    };

    mockKatakanaService.updateKatakana.mockResolvedValue(response);

    const result = await controller.updateKatakana(dto, request);

    expect(mockKatakanaService.updateKatakana).toHaveBeenCalledWith(
      dto,
      request,
    );
    expect(result).toEqual(response);
  });

  it('updateKatakanaWeight', async () => {
    const request = {
      cookies: { session_flashcard: 'token' },
    } as Request;

    const dto: UpdateKatakanaWeightDto = {
      symbol: 'ア',
      status: 'remember',
    };

    const response = {
      message: 'ア - выучил',
      katakanaId: '1',
    };

    mockKatakanaService.updateKatakanaWeight.mockResolvedValue(response);

    const result = await controller.updateKatakanaWeight(dto, request);

    expect(mockKatakanaService.updateKatakanaWeight).toHaveBeenCalledWith(
      dto,
      request,
    );
    expect(result).toEqual(response);
  });
});
