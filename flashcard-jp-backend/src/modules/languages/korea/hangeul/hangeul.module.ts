import { Module } from '@nestjs/common';
import { HangeulController } from './hangeul.controller';
import { HangeulService } from './hangeul.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/src/modules/user/user.schema';
import { Hangeul, HangeulSchema } from './hangeul.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      {
        name: Hangeul.name,
        schema: HangeulSchema,
      },
    ]),
  ],
  controllers: [HangeulController],
  providers: [HangeulService],
})
export class HangeulModule {}
