import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { HiraganaModule } from './modules/languages/japanese/hiragana/hiragana.module';
import {
  Hiragana,
  HiraganaSchema,
} from './modules/languages/japanese/hiragana/hiragana.schema';
import { KatakanaModule } from './modules/languages/japanese/katakana/katakana.module';
import {
  Katakana,
  KatakanaSchema,
} from './modules/languages/japanese/katakana/katakana.schema';
import { KanjiModule } from './modules/languages/japanese/kanji/kanji.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: Hiragana.name, schema: HiraganaSchema },
      { name: Katakana.name, schema: KatakanaSchema },
    ]),
    UserModule,
    AuthModule,
    HiraganaModule,
    KatakanaModule,
    KanjiModule,
  ],
})
export class AppModule {}
