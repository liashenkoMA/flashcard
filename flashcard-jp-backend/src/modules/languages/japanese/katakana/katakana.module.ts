import { Module } from '@nestjs/common';
import { KatakanaController } from './katakana.controller';
import { KatakanaService } from './katakana.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/src/modules/user/user.schema';
import { Katakana, KatakanaSchema } from './katakana.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Katakana.name, schema: KatakanaSchema },
    ]),
  ],
  controllers: [KatakanaController],
  providers: [KatakanaService],
})
export class KatakanaModule {}
