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
import { UpdateHiraganaDto } from './hiragana.schema.dto';

@Injectable()
export class HiraganaService implements OnModuleInit {
  async onModuleInit() {
    const count = await this.hiraganaModel.countDocuments();

    if (count === 0) {
      await this.hiraganaModel.insertMany(HIRAGANA_SEED);
      console.log('Hiragana seeded');
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

    // Создаем коллекцию Set
    const learnedSet = new Set(
      (progress?.hiragana || []).map((id) => id.toString()),
    );

    // Получаем весь список хироганы
    const hiragana = await this.hiraganaModel.find().lean();

    // Возвращаем пользователю данные
    return hiragana.map((item) => ({
      ...item,
      learned: learnedSet.has(item._id.toString()),
    }));
  }

  async updateHiragana(hiragana: UpdateHiraganaDto, request: Request) {
    const payload = await this.validateAndGetPayload(request);

    // Проверка пользователя
    const user = await this.userModel.findById(payload.sub).exec();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    // Поиск нужной хираганы
    const kana = await this.hiraganaModel
      .findOne({ symbol: hiragana.symbol })
      .exec();

    if (!kana) {
      throw new NotFoundException('Хирагана не найдена');
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

    // Добавяем выученную хирагану пользователю
    await this.userModel.updateOne(
      {
        _id: payload.sub,
        'learningProgress.language': 'jp',
      },
      {
        $addToSet: {
          'learningProgress.$.hiragana': kana._id,
        },
      },
    );

    return {
      message: `${hiragana.symbol} - выучено`,
      hiraganaId: kana._id,
    };
  }
}
