import { Test, TestingModule } from '@nestjs/testing';
import { HangeulController } from './hangeul.controller';
import { HangeulService } from './hangeul.service';
import { Request } from 'express';
import { UpdateHangeulDto, UpdateHangeulWeightDto } from './hangeul.schema.dto';

describe('HangeulController', () => {
  let mockHangeulService;
  let controller: HangeulController;

  beforeEach(async () => {
    mockHangeulService = {
      getHangeul: jest.fn(),
      updateHangeul: jest.fn(),
      updateHangeulWeight: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HangeulController],
      providers: [{ provide: HangeulService, useValue: mockHangeulService }],
    }).compile();

    controller = module.get<HangeulController>(HangeulController);
  });

  it('getHangeul', async () => {
    const request = { cookies: { session_flashcard: 'token' } } as Request;

    const response = [
      { _id: '1', symbol: '가', learned: true },
      { _id: '2', symbol: '나', learned: false },
    ];

    mockHangeulService.getHangeul.mockResolvedValue(response);

    const result = await controller.getHangeul(request);

    expect(result).toEqual(response);
    expect(mockHangeulService.getHangeul).toHaveBeenCalledWith(request);
  });

  it('updateHangeul', async () => {
    const request = { cookies: { session_flashcard: 'token' } } as Request;

    const dto: UpdateHangeulDto = {
      symbol: 'ㄱ',
    };

    const response = {
      message: 'ㄱ - выучено',
      hangeulId: '1',
      learned: true,
    };

    mockHangeulService.updateHangeul.mockResolvedValue(response);

    const result = await controller.updateHangeul(request, dto);

    expect(result).toEqual(response);
    expect(mockHangeulService.updateHangeul).toHaveBeenCalledWith(request, dto);
  });

  it('updateHangeulWeight', async () => {
    const request = { cookies: { session_flashcard: 'token' } } as Request;

    const dto: UpdateHangeulWeightDto = { symbol: 'ㄱ', status: 'remember' };

    const response = {
      message: 'ㄱ - выучил',
      katakanaId: '1',
    };

    mockHangeulService.updateHangeulWeight.mockResolvedValue(response);

    const result = await controller.updateHanguelWeight(request, dto);

    expect(result).toEqual(response);
    expect(mockHangeulService.updateHangeulWeight).toHaveBeenCalledWith(
      request,
      dto,
    );
  });
});
