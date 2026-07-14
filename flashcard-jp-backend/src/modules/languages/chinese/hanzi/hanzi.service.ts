import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Hanzi } from './hanzi.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../../user/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { HanziDto, UpdateHanziWeightDto } from './hanzi.schema.dto';
import { WEIGHT } from '../../../../shared/constants/learning.constant';

@Injectable()
export class HanziService {
  constructor(
    @InjectModel(Hanzi.name) private hanziModel: Model<Hanzi>,
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

  async addHanzi(hanzi: HanziDto, request: Request): Promise<{ data: string }> {
    const payload = await this.validateAndGetPayload(request);

    const user = await this.userModel.findById(payload.sub).exec();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    await this.hanziModel.create({
      userId: payload.sub,
      category: hanzi.category,
      hanzi: hanzi.hanzi,
      translate: hanzi.translate,
      pinyin: hanzi.pinyin,
      weight: 1,
      srs: null,
    });

    return {
      data: `${hanzi.hanzi} - добавлено`,
    };
  }

  async getHanzi(request: Request): Promise<Hanzi[]> {
    const payload = await this.validateAndGetPayload(request);

    const user = await this.userModel.findById(payload.sub).exec();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    return this.hanziModel.find({ userId: payload.sub }).exec();
  }

  async deleteHanzi(
    hanziId: string,
    request: Request,
  ): Promise<{ message: string }> {
    const payload = await this.validateAndGetPayload(request);

    const result = await this.hanziModel.deleteOne({
      _id: hanziId,
      userId: payload.sub,
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Ханзи не найдено');
    }

    return {
      message: 'Ханзи удалено',
    };
  }

  async updateHanziWeight(
    hanzi: UpdateHanziWeightDto,
    request: Request,
  ): Promise<{ message: string }> {
    const payload = await this.validateAndGetPayload(request);

    const user = await this.userModel.findById(payload.sub).exec();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    // Ищем ханзи
    const data = await this.hanziModel.findOne({
      _id: hanzi.hanziId,
      userId: payload.sub,
    });

    if (!data) {
      throw new NotFoundException('Ханзи не найдено');
    }

    // Если статус remember - уменьшаем вес
    if (hanzi.status === 'remember') {
      data.weight = Math.max(1, data.weight - 1);
    }

    // Если статус forgot - увеличиваем вес
    if (hanzi.status === 'forgot') {
      data.weight = Math.min(WEIGHT.MAX_CARD_WEIGHT, data.weight + 1);
    }

    await data.save();

    return {
      message: `${data.hanzi} - вес изменен`,
    };
  }
}
