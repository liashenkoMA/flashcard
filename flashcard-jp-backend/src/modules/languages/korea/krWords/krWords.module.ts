import { User, UserSchema } from '@/src/modules/user/user.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WordKr, WordsKrSchema } from './krWords.schema';
import { WordsKrController } from './krWords.controller';
import { WordsKrService } from './krWords.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: WordKr.name, schema: WordsKrSchema },
    ]),
  ],
  controllers: [WordsKrController],
  providers: [WordsKrService],
})
export class WordsKrModule {}
