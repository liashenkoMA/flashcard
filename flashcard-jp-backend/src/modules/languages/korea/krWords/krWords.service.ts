import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WordKr } from './krWords.schema';
import { Model } from 'mongoose';
import { User } from '../../../user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UpdateWordKrWeightDto, WordKrDto } from './krWords.schema.dto';
import { WEIGHT } from '../../../../shared/constants/learning.constant';

@Injectable()
export class WordsKrService {
  constructor(
    @InjectModel(WordKr.name) private wordModel: Model<WordKr>,
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  private async validateAndGetPayload(request: Request) {
    const token = request?.cookies?.['session_flashcard'];

    if (!token) {
      throw new UnauthorizedException('Не авторизованы');
    }

    try {
      return await this.jwtService.verifyAsync<{ sub: string }>(token, {
        secret: process.env.JWT_CONSTANT,
      });
    } catch {
      throw new UnauthorizedException('Невалидный токен');
    }
  }

  async addWord(request: Request, word: WordKrDto): Promise<{ data: string }> {
    const payload = await this.validateAndGetPayload(request);

    const user = await this.userModel.findById(payload.sub).exec();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    await this.wordModel.create({
      userId: payload.sub,
      word: word.word,
      translate: word.translate,
      category: word.category,
      weight: 1,
      srs: null,
    });

    return {
      data: `${word.word} - добавлено`,
    };
  }

  async getWord(request: Request) {
    const payload = await this.validateAndGetPayload(request);

    const user = await this.userModel.findById(payload.sub).exec();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    return this.wordModel.find({ userId: payload.sub }).exec();
  }

  async deleteWord(
    request: Request,
    wordId: string,
  ): Promise<{ message: string }> {
    const payload = await this.validateAndGetPayload(request);

    const result = await this.wordModel.deleteOne({
      _id: wordId,
      userId: payload.sub,
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Слово не найдено');
    }

    return {
      message: 'Слово удалено',
    };
  }

  async getWordsCategory(request: Request): Promise<string[]> {
    const payload = await this.validateAndGetPayload(request);

    const user = await this.userModel.findById(payload.sub).exec();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    return this.wordModel.distinct('category', {
      userId: payload.sub,
    });
  }

  async updateWordWeight(request: Request, word: UpdateWordKrWeightDto) {
    const payload = await this.validateAndGetPayload(request);

    const user = await this.userModel.findById(payload.sub).exec();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    // Ищем слово
    const data = await this.wordModel.findOne({
      _id: word.wordId,
      userId: payload.sub,
    });

    if (!data) {
      throw new NotFoundException('Слово не найдено');
    }

    // Если статус remember - уменьшаем вес
    if (word.status === 'remember') {
      data.weight = Math.max(1, data.weight - 1);
    }

    // Если статус forgot - увеличиваем вес
    if (word.status === 'forgot') {
      data.weight = Math.min(WEIGHT.MAX_CARD_WEIGHT, data.weight + 1);
    }

    await data.save();

    return {
      message: `${data.word} - вес изменен`,
    };
  }
}
