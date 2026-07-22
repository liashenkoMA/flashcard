import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginResponseDto } from '../user/user.schema.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  private hasActiveSubscription(user: User): boolean {
    if (!user.subscription) {
      return false;
    }

    const now = new Date();

    return user.subscription.expiresAt > now;
  }

  async signIn(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.userModel.findOne({ email: email }).exec();

    if (!user) {
      // Чтобы не догадались, есть такой пользователь или нет
      throw new UnauthorizedException('Почта или пароль не верные');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Почта или пароль не верные');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Почта не подтверждена');
    }

    const payload = { sub: user._id.toString() };
    const jwt = await this.jwtService.signAsync(payload, { expiresIn: '7d' });

    return {
      access_token: jwt,
      user: {
        name: user.name,
        email: user.email,
        subscription: {
          active: this.hasActiveSubscription(user),
          expiresAt: user.subscription?.expiresAt ?? null,
        },
      },
    };
  }
}
