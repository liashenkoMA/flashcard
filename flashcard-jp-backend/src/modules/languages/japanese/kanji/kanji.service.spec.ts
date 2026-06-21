import { Test, TestingModule } from '@nestjs/testing';
import { KanjiService } from './kanji.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Kanji } from './kanji.schema';
import { User } from '../../../user/user.schema';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('KanjiService', () => {
  let service: KanjiService;
  let mockJwtService: any;
  let mockKanjiModel: any;
  let mockUserModel: any;

  beforeEach(async () => {
    jest.resetAllMocks();

    mockJwtService = {
      verifyAsync: jest.fn(),
    };

    mockKanjiModel = {
      create: jest.fn(),
      find: jest.fn(),
      deleteOne: jest.fn(),
      findOne: jest.fn(),
    };

    mockUserModel = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KanjiService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getModelToken(Kanji.name),
          useValue: mockKanjiModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<KanjiService>(KanjiService);
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

  describe('addKanji', () => {
    it('Ошибка если пользователь не найден', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.addKanji(
          {
            kanji: '日',
            translate: 'sun',
            jpRead: 'にち',
            chinaRead: 'ri',
          } as any,
          { cookies: {} } as any,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('Успешное добавление кандзи', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'user_id' }),
      });

      mockKanjiModel.create.mockResolvedValue({});

      const result = await service.addKanji(
        {
          kanji: '日',
          translate: 'sun',
          jpRead: 'にち',
          chinaRead: 'ri',
        } as any,
        { cookies: {} } as any,
      );

      expect(mockKanjiModel.create).toHaveBeenCalledWith({
        userId: 'user_id',
        kanji: '日',
        translate: 'sun',
        jpRead: 'にち',
        chinaRead: 'ri',
        weight: 1,
        srs: null,
      });

      expect(result).toEqual({
        data: '日 - добавлено',
      });
    });
  });

  describe('getKanji', () => {
    it('Ошибка если пользователь не найден', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getKanji({ cookies: {} } as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('Успешное получение кандзи', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'user_id' }),
      });

      const kanjiList = [
        { _id: '1', kanji: '日' },
        { _id: '2', kanji: '月' },
      ];

      mockKanjiModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(kanjiList),
      });

      const result = await service.getKanji({ cookies: {} } as any);

      expect(mockKanjiModel.find).toHaveBeenCalledWith({
        userId: 'user_id',
      });

      expect(result).toEqual(kanjiList);
    });
  });

  describe('deleteKanji', () => {
    it('Ошибка если кандзи не найдено', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockKanjiModel.deleteOne.mockResolvedValue({
        deletedCount: 0,
      });

      await expect(
        service.deleteKanji('kanji_id', { cookies: {} } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('Успешное удаление кандзи', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockKanjiModel.deleteOne.mockResolvedValue({
        deletedCount: 1,
      });

      const result = await service.deleteKanji('kanji_id', {
        cookies: {},
      } as any);

      expect(mockKanjiModel.deleteOne).toHaveBeenCalledWith({
        _id: 'kanji_id',
        userId: 'user_id',
      });

      expect(result).toEqual({
        message: 'Кандзи удалено',
      });
    });
  });

  describe('updateKanjiWeight', () => {
    it('Ошибка если пользователь не найден', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateKanjiWeight(
          {
            kanjiId: '123',
            status: 'remember',
          },
          { cookies: {} } as any,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('Ошибка если кандзи не найдено', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'user_id',
        }),
      });

      mockKanjiModel.findOne.mockResolvedValue(null);

      await expect(
        service.updateKanjiWeight(
          {
            kanjiId: '123',
            status: 'remember',
          },
          { cookies: {} } as any,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('Уменьшает вес при remember', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'user_id',
        }),
      });

      const kanji = {
        _id: '123',
        kanji: '日',
        weight: 3,
        save: jest.fn(),
      };

      mockKanjiModel.findOne.mockResolvedValue(kanji);

      const result = await service.updateKanjiWeight(
        {
          kanjiId: '123',
          status: 'remember',
        },
        { cookies: {} } as any,
      );

      expect(kanji.weight).toBe(2);
      expect(kanji.save).toHaveBeenCalled();
      expect(result).toEqual({
        message: '日 - вес изменен',
      });
    });

    it('Увеличивает вес при forgot', async () => {
      jest.spyOn(service as any, 'validateAndGetPayload').mockResolvedValue({
        sub: 'user_id',
      });

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'user_id',
        }),
      });

      const kanji = {
        _id: '123',
        kanji: '月',
        weight: 2,
        save: jest.fn(),
      };

      mockKanjiModel.findOne.mockResolvedValue(kanji);

      const result = await service.updateKanjiWeight(
        {
          kanjiId: '123',
          status: 'forgot',
        },
        { cookies: {} } as any,
      );

      expect(kanji.weight).toBe(3);
      expect(kanji.save).toHaveBeenCalled();
      expect(result).toEqual({
        message: '月 - вес изменен',
      });
    });
  });
});
