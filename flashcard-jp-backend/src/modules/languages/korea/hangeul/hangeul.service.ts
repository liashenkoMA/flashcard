import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Hangeul } from './hangeul.schema';
import { Model } from 'mongoose';
import { User } from '../../../user/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class HangeulService {
  constructor(
    @InjectModel(Hangeul.name) private hangeulModel: Model<Hangeul>,
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  private async validateAndGetPayload(request) {}

  async getHangeul(request) {}

  async updateHangeul(request, hangeul) {}

  async updateHangeulWeight(request, hangeul) {}
}
