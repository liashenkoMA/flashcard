import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Hiragana } from './hiragana.schema';
import { Model } from 'mongoose';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../user/user.schema';
import { HIRAGANA_SEED } from './hiragana.seed';
import { OnModuleInit } from '@nestjs/common';
import {
  UpdateHiraganaDto,
  UpdateHiraganaWeightDto,
} from './hiragana.schema.dto';
import { WEIGHT } from '../../../../shared/constants/learning.constant';

@Injectable()
export class HiraganaService implements OnModuleInit {
  async onModuleInit() {
    const count = await this.hiraganaModel.countDocuments();

    if (count === 0) {
      await this.hiraganaModel.insertMany(HIRAGANA_SEED);
    }
  }

  constructor(
    @InjectModel(Hiragana.name) private hiraganaModel: Model<Hiragana>,
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  private async validateAndGetPayload(request: Request) {
    const token = request?.cookies?.['session_flashcard'];

    if (!token) {
      throw new UnauthorizedException('Не авторизованы');
    }

    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string }>(
        token,
        {
          secret: process.env.JWT_CONSTANT,
        },
      );
      return payload;
    } catch {
      throw new UnauthorizedException('Невалидный токен');
    }
  }

  async getHiragana(request: Request) {
    const payload = await this.validateAndGetPayload(request);
    // Проверка пользователя
    const user = await this.userModel
      .findById(payload.sub)
      .select('learningProgress')
      .lean();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    // Получаем весь прогресс пользователя
    const progress = user.learningProgress?.find((p) => p.language === 'jp');

    const learnedMap = new Map(
      (progress?.hiragana || []).map((h: any) => [h.id.toString(), h.weight]),
    );

    // Получаем весь список хироганы
    const hiragana = await this.hiraganaModel.find().lean();

    return hiragana.map((item) => ({
      ...item,
      learned: learnedMap.has(item._id.toString()),
      weight: learnedMap.get(item._id.toString()) ?? 0,
    }));
  }

  async updateHiragana(hiragana: UpdateHiraganaDto, request: Request) {
    const payload = await this.validateAndGetPayload(request);

    // Проверка пользователя
    const user = await this.userModel.findById(payload.sub).exec();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    // Ищем хирагану
    const kana = await this.hiraganaModel
      .findOne({ symbol: hiragana.symbol })
      .exec();

    if (!kana) {
      throw new NotFoundException('Хирагана не найдена');
    }

    // Находим progress пользователя
    let progress = user.learningProgress.find((p) => p.language === 'jp');

    // Если нет - создаем
    if (!progress) {
      progress = {
        language: 'jp',
        hiragana: [],
        katakana: [],
      };

      user.learningProgress.push(progress);
    }

    // Проверяем, выучена ли кана или нет
    const index = progress.hiragana.findIndex(
      (h: any) => h.id.toString() === kana._id.toString(),
    );

    let learned: boolean;

    // хирагана уже есть у пользователя? Значит "убрать"
    if (index !== -1) {
      // удаляем элемент из массива прогресса
      progress.hiragana.splice(index, 1);
      learned = false;
    } else {
      // хираганы нет у пользователя? Значит "Добавить"
      progress.hiragana.push({
        id: kana._id,

        // Стартовый вес каны
        weight: 1,
      } as any);

      learned = true;
    }

    await user.save();

    return {
      message: learned
        ? `${hiragana.symbol} - выучено`
        : `${hiragana.symbol} - удалено`,
      hiraganaId: kana._id,
    };
  }

  async updateHiraganaWeight(
    hiragana: UpdateHiraganaWeightDto,
    request: Request,
  ) {
    const payload = await this.validateAndGetPayload(request);

    // Проверка пользователя
    const user = await this.userModel.findById(payload.sub).exec();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    // Ищем хирагану
    const kana = await this.hiraganaModel
      .findOne({ symbol: hiragana.symbol })
      .exec();

    if (!kana) {
      throw new NotFoundException('Хирагана не найдена');
    }

    // Находим progress пользователя
    const progress = user.learningProgress.find((p) => p.language === 'jp');

    const kanaProgress = progress.hiragana.find(
      (h) => h.id.toString() === kana._id.toString(),
    );

    // Если статус remember - уменьшаем вес
    if (hiragana.status === 'remember') {
      kanaProgress.weight = Math.max(1, kanaProgress.weight - 1);
    }

    // Если статус forgot - увеличиваем вес
    if (hiragana.status === 'forgot') {
      kanaProgress.weight = Math.min(
        WEIGHT.MAX_CARD_WEIGHT,
        kanaProgress.weight + 1,
      );
    }

    await user.save();

    return {
      message:
        hiragana.status === 'remember'
          ? `${hiragana.symbol} - выучил`
          : `${hiragana.symbol} - забыл`,
      hiraganaId: kana._id,
    };
  }
}
