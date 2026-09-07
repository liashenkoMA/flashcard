import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import {
  CreateUserDto,
  GetUserResponseDto,
  GetUserUsageDto,
  UpdateUserDto,
  UpdateUserResponseDto,
} from './user.schema.dto';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Kanji } from '../languages/japanese/kanji/kanji.schema';
import { WordJp } from '../languages/japanese/words/words.schema';
import { Hanzi } from '../languages/chinese/hanzi/hanzi.schema';
import { WordCn } from '../languages/chinese/wordsCn/wordsCn.schema';
import { WordKr } from '../languages/korea/krWords/krWords.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Kanji.name) private kanjiModel: Model<Kanji>,
    @InjectModel(WordJp.name) private wordJpModel: Model<WordJp>,
    @InjectModel(Hanzi.name) private hanziModel: Model<Hanzi>,
    @InjectModel(WordCn.name) private wordCnModel: Model<WordCn>,
    @InjectModel(WordKr.name) private wordKrModel: Model<WordKr>,
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

  private hasActiveSubscription(user: User): boolean {
    if (!user.subscription) {
      return false;
    }

    const now = new Date();

    return user.subscription.expiresAt > now;
  }

  async createUser(user: CreateUserDto): Promise<{ data: string }> {
    const oldUser = await this.userModel.findOne({ email: user.email }).exec();

    if (oldUser) {
      throw new ConflictException(
        'Пользователь с такой почтой уже существует.',
      );
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(user.password, salt);

    const createUser = new this.userModel({
      name: user.name,
      email: user.email,
      password: password,
    });

    await createUser.save();

    return {
      data: 'Спасибо за регистрацию, пользователь успешно создан!',
    };
  }

  async getUser(request: Request): Promise<GetUserResponseDto> {
    const payload = await this.validateAndGetPayload(request);

    const user = await this.userModel.findById(payload.sub).exec();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    return {
      name: user.name,
      email: user.email,
      subscription: {
        active: this.hasActiveSubscription(user),
        expiresAt: user.subscription?.expiresAt ?? null,
      },
    };
  }

  async getUserUsage(request: Request): Promise<GetUserUsageDto> {
    const payload = await this.validateAndGetPayload(request);

    const user = await this.userModel.findById(payload.sub).exec();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    const [hanzi, wordCn, kanji, wordJp, wordKr] = await Promise.all([
      this.hanziModel.countDocuments({ userId: payload.sub }).exec(),
      this.wordCnModel.countDocuments({ userId: payload.sub }).exec(),
      this.kanjiModel.countDocuments({ userId: payload.sub }).exec(),
      this.wordJpModel.countDocuments({ userId: payload.sub }).exec(),
      this.wordKrModel.countDocuments({ userId: payload.sub }).exec(),
    ]);

    return {
      hanzi,
      wordCn,
      kanji,
      wordJp,
      wordKr,
    };
  }

  async updateUser(
    userData: UpdateUserDto,
    request: Request,
  ): Promise<UpdateUserResponseDto> {
    const payload = await this.validateAndGetPayload(request);

    const user = await this.userModel.findById(payload.sub).exec();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    const isPasswordValid = await bcrypt.compare(
      userData.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException(
        'Неверный пароль, обновление данных невозможно',
      );
    }

    const updateData: Partial<User> = {
      name: userData.name,
      email: userData.email,
    };

    if (userData.newPassword) {
      const isSame = await bcrypt.compare(userData.newPassword, user.password);

      if (isSame) {
        throw new BadRequestException(
          'Этот пароль уже используется, попробуйте другой',
        );
      }

      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(userData.newPassword, salt);
    }

    const updatedUser = await this.userModel
      .findOneAndUpdate(
        {
          email: user.email,
        },
        updateData,
        {
          new: true,
          runValidators: true,
        },
      )
      .select('-password')
      .exec();

    return {
      name: updatedUser.name,
      email: updatedUser.email,
    };
  }

  async deleteUser(request: Request) {
    const payload = await this.validateAndGetPayload(request);

    await this.userModel.findByIdAndDelete(payload.sub).exec();

    return;
  }
}
