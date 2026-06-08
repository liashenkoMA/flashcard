import { Module } from '@nestjs/common';
import { WordsController } from './words.controller';
import { WordsService } from './words.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/src/modules/user/user.schema';
import { Words, WordsSchema } from './words.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Words.name, schema: WordsSchema },
    ]),
  ],
  controllers: [WordsController],
  providers: [WordsService],
})
export class WordsModule {}
