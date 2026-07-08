import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hiragana } from './modules/languages/japanese/hiragana/hiragana.schema';
import { HIRAGANA_SEED } from './modules/languages/japanese/hiragana/hiragana.seed';
import { Katakana } from './modules/languages/japanese/katakana/katakana.schema';
import { KATAKANA_SEED } from './modules/languages/japanese/katakana/katakana.seed';
import { Hangeul } from './modules/languages/korea/hangeul/hangeul.schema';
import { HANGUL_SEED } from './modules/languages/korea/hangeul/hangeul.seed';

async function seedCollection(model, data) {
  const count = await model.countDocuments();

  if (count === 0) {
    await model.insertMany(data);
    console.log(`${model.modelName} seeded`);
  } else {
    console.log(`${model.modelName} already exists`);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const hiraganaModel = app.get<Model<Hiragana>>(getModelToken(Hiragana.name));
  const katakanaModel = app.get<Model<Katakana>>(getModelToken(Katakana.name));
  const hangeulModel = app.get<Model<Hangeul>>(getModelToken(Hangeul.name));

  await seedCollection(hiraganaModel, HIRAGANA_SEED);
  await seedCollection(katakanaModel, KATAKANA_SEED);
  await seedCollection(hangeulModel, HANGUL_SEED);

  await app.close();
}

bootstrap();
