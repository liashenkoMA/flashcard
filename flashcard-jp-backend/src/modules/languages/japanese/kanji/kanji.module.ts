import { Module } from '@nestjs/common';
import { KanjiService } from './kanji.service';
import { KanjiController } from './kanji.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/src/modules/user/user.schema';
import { Kanji, KanjiSchema } from './kanji.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Kanji.name, schema: KanjiSchema },
    ]),
  ],
  controllers: [KanjiController],
  providers: [KanjiService],
})
export class KanjiModule {}
