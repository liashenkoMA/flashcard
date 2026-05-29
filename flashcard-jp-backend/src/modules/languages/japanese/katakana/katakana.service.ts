import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Katakana } from './katakana.schema';
import { Model } from 'mongoose';
import { KATAKANA_SEED } from './katakana.seed';
import { User } from '../../../user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UpdateKatakanaDto } from './katakana.schema.dto';

@Injectable()
export class KatakanaService implements OnModuleInit {
  async onModuleInit() {
    const count = await this.katakanaModel.countDocuments();

    if (count === 0) {
      await this.katakanaModel.insertMany(KATAKANA_SEED);
    }
  }

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
    const learnedSet = new Set(
      (progress?.katakana || []).map((id) => id.toString()),
    );

    // Получаем весь список катаканы
    const katakana = await this.katakanaModel.find().lean();

    // Возвращаем пользователю данные
    return katakana.map((item) => ({
      ...item,
      learned: learnedSet.has(item._id.toString()),
    }));
  }

  async updateKatakana(katakana: UpdateKatakanaDto, request: Request) {
    const payload = await this.validateAndGetPayload(request);

    // Проверка пользователя
    const user = await this.userModel.findById(payload.sub).exec();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    // Поиск нужной катаканы
    const kana = await this.katakanaModel
      .findOne({ symbol: katakana.symbol })
      .exec();

    if (!kana) {
      throw new NotFoundException('Катакана не найдена');
    }

    // Создаем progress, если его нет
    await this.userModel.updateOne(
      {
        _id: payload.sub,
        'learningProgress.language': { $ne: 'jp' },
      },
      {
        $push: {
          learningProgress: {
            language: 'jp',
            hiragana: [],
            katakana: [],
            kanji: [],
            words: [],
          },
        },
      },
    );

    // Добавяем выученную катакану пользователю
    await this.userModel.updateOne(
      {
        _id: payload.sub,
        'learningProgress.language': 'jp',
      },
      {
        $addToSet: {
          'learningProgress.$.katakana': kana._id,
        },
      },
    );

    return {
      message: `${katakana.symbol} - выучено`,
      katakanaId: kana._id,
    };
  }
}
