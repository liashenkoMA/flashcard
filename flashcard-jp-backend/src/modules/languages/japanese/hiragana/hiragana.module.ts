import { Module } from '@nestjs/common';
import { HiraganaService } from './hiragana.service';
import { HiraganaController } from './hiragana.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../../user/user.schema';
import { Hiragana, HiraganaSchema } from './hiragana.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Hiragana.name, schema: HiraganaSchema },
    ]),
  ],
  controllers: [HiraganaController],
  providers: [HiraganaService],
})
export class HiraganaModule {}
