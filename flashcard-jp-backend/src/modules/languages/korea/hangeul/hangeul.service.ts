import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Hangeul } from './hangeul.schema';
import { Model } from 'mongoose';
import { User } from '../../../user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UpdateHangeulDto, UpdateHangeulWeightDto } from './hangeul.schema.dto';
import { WEIGHT } from '../../../../shared/constants/learning.constant';

@Injectable()
export class HangeulService {
  constructor(
    @InjectModel(Hangeul.name) private hangeulModel: Model<Hangeul>,
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

  async getHangeul(request: Request) {
    const payload = await this.validateAndGetPayload(request);

    const user = await this.userModel
      .findById(payload.sub)
      .select('learningProgress')
      .lean();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    // Получаем весь прогресс пользователя
    const progress = user.learningProgress?.find((p) => p.language === 'kr');

    const learnedMap = new Map(
      (progress?.hangul || []).map((h) => [h.id.toString(), h.weight]),
    );

    // Получаем все символы
    const hangeul = await this.hangeulModel.find().lean();

    return hangeul.map((item) => ({
      ...item,
      learned: learnedMap.has(item._id.toString()),
      weight: learnedMap.get(item._id.toString()) ?? 0,
    }));
  }

  async updateHangeul(request: Request, hangeul: UpdateHangeulDto) {
    const payload = await this.validateAndGetPayload(request);

    const user = await this.userModel.findById(payload.sub).exec();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    // ищем hangeul
    const symbol = await this.hangeulModel
      .findOne({ symbol: hangeul.symbol })
      .exec();

    if (!symbol) {
      throw new NotFoundException('Символ не найден');
    }

    // ищем или создаем прогресс
    let progress = user.learningProgress.find((p) => p.language === 'kr');

    if (!progress) {
      progress = {
        language: 'kr',
        hangul: [],
      };

      user.learningProgress.push(progress);
    }

    // проверяем есть ли уже элемент
    const index = progress.hangul.findIndex(
      (h) => h.id.toString() === symbol.id.toString(),
    );

    let learned: boolean;

    if (index !== -1) {
      // remove
      progress.hangul.splice(index, 1);
      learned = false;
    } else {
      // add
      progress.hangul.push({
        id: symbol._id,
        weight: 1,
      });

      learned = true;
    }

    await user.save();

    return {
      message: learned
        ? `${hangeul.symbol} - выучено`
        : `${hangeul.symbol} - удалено`,
      hangeulId: symbol._id,
      learned,
    };
  }

  async updateHangeulWeight(request: Request, hangeul: UpdateHangeulWeightDto) {
    const payload = await this.validateAndGetPayload(request);

    const user = await this.userModel.findById(payload.sub).exec();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    //Ищем символ
    const symbol = await this.hangeulModel
      .findOne({ symbol: hangeul.symbol })
      .exec();

    if (!symbol) {
      throw new NotFoundException('Символ не найден');
    }

    // Находим progress пользователя
    const progress = user.learningProgress.find((p) => p.language === 'kr');

    const hanguelProgress = progress.hangul.find(
      (h) => h.id.toString() === symbol._id.toString(),
    );

    // Если статус remember - уменьшаем вес
    if (hangeul.status === 'remember') {
      hanguelProgress.weight = Math.max(1, hanguelProgress.weight - 1);
    }

    // Если статус forgot - увеличиваем вес
    if (hangeul.status === 'forgot') {
      hanguelProgress.weight = Math.min(
        WEIGHT.MAX_CARD_WEIGHT,
        hanguelProgress.weight + 1,
      );
    }

    await user.save();

    return {
      message:
        hangeul.status === 'remember'
          ? `${hangeul.symbol} - выучил`
          : `${hangeul.symbol} - забыл`,
      hangeulId: symbol._id,
    };
  }
}
