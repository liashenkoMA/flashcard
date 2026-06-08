import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Word } from './words.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../../user/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { WordDto } from './words.schema.dto';

@Injectable()
export class WordsService {
  constructor(
    @InjectModel(Word.name) private wordModel: Model<Word>,
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

  async addWord(word: WordDto, request: Request): Promise<{ data: string }> {
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

  async getWord(request) {
    const payload = await this.validateAndGetPayload(request);

    const user = await this.userModel.findById(payload.sub).exec();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    return this.wordModel.find({ userId: payload.sub }).exec();
  }

  async deleteWord(
    wordId: string,
    request: Request,
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
}
