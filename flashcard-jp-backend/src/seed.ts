import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hiragana } from './modules/languages/japanese/hiragana/hiragana.schema';
import { HIRAGANA_SEED } from './modules/languages/japanese/hiragana/hiragana.seed';
import { Katakana } from './modules/languages/japanese/katakana/katakana.schema';
import { KATAKANA_SEED } from './modules/languages/japanese/katakana/katakana.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const hiraganaModel = app.get<Model<Hiragana>>(getModelToken(Hiragana.name));
  const katakanaModel = app.get<Model<Katakana>>(getModelToken(Katakana.name));

  await hiraganaModel.deleteMany({});
  await hiraganaModel.insertMany(HIRAGANA_SEED);

  await katakanaModel.deleteMany({});
  await katakanaModel.insertMany(KATAKANA_SEED);

  await app.close();
}

bootstrap();
