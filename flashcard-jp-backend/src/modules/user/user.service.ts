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
  UpdateUserDto,
  UserResponseDto,
} from './user.schema.dto';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  private async validateAndGetPayload(request: Request) {
    const token = request?.cookies?.['session_flashcard'];

    if (!token) {
      throw new UnauthorizedException('Не авторизованы');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_CONSTANT,
      });
      return payload;
    } catch {
      throw new UnauthorizedException('Невалидный токен');
    }
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

  async getUser(request: Request): Promise<{ name: string; email: string }> {
    const payload = await this.validateAndGetPayload(request);

    const user = await this.userModel
      .findOne({ email: payload.username })
      .exec();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    return {
      name: user.name,
      email: user.email,
    };
  }

  async updateUser(
    userData: UpdateUserDto,
    request: Request,
  ): Promise<UserResponseDto> {
    const payload = await this.validateAndGetPayload(request);

    const user = await this.userModel
      .findOne({ email: payload.username })
      .exec();

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

    await this.userModel.findOneAndDelete({ email: payload.username }).exec();

    return;
  }
}
