import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { HiraganaModule } from './modules/languages/japanese/hiragana/hiragana.module';
import {
  Hiragana,
  HiraganaSchema,
} from './modules/languages/japanese/hiragana/hiragana.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: Hiragana.name, schema: HiraganaSchema },
    ]),
    UserModule,
    AuthModule,
    HiraganaModule,
  ],
})
export class AppModule {}
