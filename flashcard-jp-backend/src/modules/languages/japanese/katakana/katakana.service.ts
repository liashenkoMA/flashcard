import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Katakana } from './katakana.schema';
import { Model } from 'mongoose';
import { User } from '../../../user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import {
  UpdateKatakanaDto,
  UpdateKatakanaWeightDto,
} from './katakana.schema.dto';
import { WEIGHT } from '../../../../shared/constants/learning.constant';

@Injectable()
export class KatakanaService {
  constructor(
    @InjectModel(Katakana.name) private katakanaModel: Model<Katakana>,
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

  async getKatakana(request: Request) {
    const payload = await this.validateAndGetPayload(request);

    const user = await this.userModel
      .findById(payload.sub)
      .select('learningProgress')
      .lean();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    // Получаем весь прогресс пользователя
    const progress = user.learningProgress?.find((p) => p.language === 'jp');

    // Создаем коллекцию Set с выученной каной
    const learnedMap = new Map(
      (progress?.katakana || []).map((k: any) => [k.id.toString(), k.weight]),
    );

    // Получаем весь список катаканы
    const katakana = await this.katakanaModel.find().lean();

    // Возвращаем пользователю данные
    return katakana.map((item) => ({
      ...item,
      weight: learnedMap.get(item._id.toString()) ?? 0,
      learned: learnedMap.has(item._id.toString()),
    }));
  }

  async updateKatakana(katakana: UpdateKatakanaDto, request: Request) {
    const payload = await this.validateAndGetPayload(request);

    const user = await this.userModel.findById(payload.sub).exec();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    // ищем кану
    const kana = await this.katakanaModel
      .findOne({ symbol: katakana.symbol })
      .exec();

    if (!kana) {
      throw new NotFoundException('Катакана не найдена');
    }

    // ищем или создаём jp progress
    let progress = user.learningProgress.find((p) => p.language === 'jp');

    if (!progress) {
      progress = {
        language: 'jp',
        hiragana: [],
        katakana: [],
      };

      user.learningProgress.push(progress);
    }

    // проверяем есть ли уже элемент
    const index = progress.katakana.findIndex(
      (k: any) => k.id.toString() === kana._id.toString(),
    );

    let learned: boolean;

    if (index !== -1) {
      // remove
      progress.katakana.splice(index, 1);
      learned = false;
    } else {
      // add
      progress.katakana.push({
        id: kana._id,
        weight: 1,
      } as any);

      learned = true;
    }

    await user.save();

    return {
      message: learned
        ? `${katakana.symbol} - выучено`
        : `${katakana.symbol} - удалено`,
      katakanaId: kana._id,
      learned,
    };
  }

  async updateKatakanaWeight(
    katakana: UpdateKatakanaWeightDto,
    request: Request,
  ) {
    const payload = await this.validateAndGetPayload(request);

    // Проверка пользователя
    const user = await this.userModel.findById(payload.sub).exec();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    // Ищем катакану
    const kana = await this.katakanaModel
      .findOne({ symbol: katakana.symbol })
      .exec();

    if (!kana) {
      throw new NotFoundException('Катакана не найдена');
    }

    // Находим progress пользователя
    const progress = user.learningProgress.find((p) => p.language === 'jp');

    const kanaProgress = progress.katakana.find(
      (k) => k.id.toString() === kana._id.toString(),
    );

    // Если статус remember - уменьшаем вес
    if (katakana.status === 'remember') {
      kanaProgress.weight = Math.max(1, kanaProgress.weight - 1);
    }

    // Если статус forgot - увеличиваем вес
    if (katakana.status === 'forgot') {
      kanaProgress.weight = Math.min(
        WEIGHT.MAX_CARD_WEIGHT,
        kanaProgress.weight + 1,
      );
    }

    await user.save();

    return {
      message:
        katakana.status === 'remember'
          ? `${katakana.symbol} - выучил`
          : `${katakana.symbol} - забыл`,
      katakanaId: kana._id,
    };
  }
}
