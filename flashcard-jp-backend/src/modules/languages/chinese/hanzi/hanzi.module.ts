import { User, UserSchema } from '@/src/modules/user/user.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Hanzi, HanziSchema } from './hanzi.schema';
import { HanziController } from './hanzi.controller';
import { HanziService } from './hanzi.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Hanzi.name, schema: HanziSchema },
    ]),
  ],
  controllers: [HanziController],
  providers: [HanziService],
})
export class HanziModule {}
