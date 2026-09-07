import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { Hanzi, HanziSchema } from '../languages/chinese/hanzi/hanzi.schema';
import {
  WordCn,
  WordCnSchema,
} from '../languages/chinese/wordsCn/wordsCn.schema';
import { Kanji, KanjiSchema } from '../languages/japanese/kanji/kanji.schema';
import {
  WordKr,
  WordsKrSchema,
} from '../languages/korea/krWords/krWords.schema';
import { WordJp, WordsSchema } from '../languages/japanese/words/words.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Hanzi.name, schema: HanziSchema },
      { name: WordCn.name, schema: WordCnSchema },
      { name: Kanji.name, schema: KanjiSchema },
      { name: WordJp.name, schema: WordsSchema },
      { name: WordKr.name, schema: WordsKrSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
