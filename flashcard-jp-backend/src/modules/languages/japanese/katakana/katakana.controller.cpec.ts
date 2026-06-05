import { Test, TestingModule } from '@nestjs/testing';
import { KatakanaController } from './katakana.controller';
import { KatakanaService } from './katakana.service';
import { UpdateKatakanaDto } from './katakana.schema.dto';

describe('KatakanaController', () => {
  let controller: KatakanaController;
  let mockKatakanaService;

  beforeEach(async () => {
    mockKatakanaService = {
      getKatakana: jest.fn(),
      updateKatakana: jest.fn(),
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
    } as any;

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
    } as any;

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
});
