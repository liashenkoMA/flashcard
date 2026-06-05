import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Kanji } from './kanji.schema';
import { User } from '../../../user/user.schema';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { KanjiDto } from './kanji.schema.dto';

@Injectable()
export class KanjiService {
  constructor(
    @InjectModel(Kanji.name) private kanjiModel: Model<Kanji>,
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

  async addKanji(kanji: KanjiDto, request: Request): Promise<{ data: string }> {
    const payload = await this.validateAndGetPayload(request);

    const user = await this.userModel.findById(payload.sub).exec();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    await this.kanjiModel.create({
      userId: payload.sub,
      kanji: kanji.kanji,
      translate: kanji.translate,
      jpRead: kanji.jpRead,
      chinaRead: kanji.chinaRead,
      weight: 1,
      srs: null,
    });

    return {
      data: `${kanji.kanji} - добавлено`,
    };
  }

  async getKanji(request: Request) {
    const payload = await this.validateAndGetPayload(request);

    const user = await this.userModel.findById(payload.sub).exec();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    return this.kanjiModel.find({ userId: payload.sub }).exec();
  }

  async deleteKanji(kanjiId: string, request: Request) {
    const payload = await this.validateAndGetPayload(request);

    const result = await this.kanjiModel.deleteOne({
      _id: kanjiId,
      userId: payload.sub,
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Кандзи не найдено');
    }

    return {
      message: 'Кандзи удалено',
    };
  }
}
