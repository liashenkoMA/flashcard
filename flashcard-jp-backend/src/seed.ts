import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hiragana } from './modules/languages/japanese/hiragana/hiragana.schema';
import { HIRAGANA_SEED } from './modules/languages/japanese/hiragana/hiragana.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const hiraganaModel = app.get<Model<Hiragana>>(getModelToken(Hiragana.name));

  await hiraganaModel.deleteMany({});
  await hiraganaModel.insertMany(HIRAGANA_SEED);

  await app.close();
}

bootstrap();
