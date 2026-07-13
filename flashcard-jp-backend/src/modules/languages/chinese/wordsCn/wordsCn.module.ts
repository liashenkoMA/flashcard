import { Module } from '@nestjs/common';
import { User, UserSchema } from '@/src/modules/user/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { WordCn, WordCnSchema } from './wordsCn.schema';
import { WordCnController } from './wordsCn.controller';
import { WordCnService } from './wordsCn.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: WordCn.name, schema: WordCnSchema },
    ]),
  ],
  controllers: [WordCnController],
  providers: [WordCnService],
})
export class WordCnModule {}
