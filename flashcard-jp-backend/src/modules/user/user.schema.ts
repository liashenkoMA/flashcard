import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { isEmail } from 'validator';

@Schema()
export class LearningProgress {
  @Prop({
    required: true,
    enum: ['jp', 'cn'],
  })
  language: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Kanji' }], default: [] })
  kanji: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Words' }], default: [] })
  words: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Hiragana' }], default: [] })
  hiragana: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Katakana' }], default: [] })
  katakana: Types.ObjectId[];
}

export const LearningProgressSchema =
  SchemaFactory.createForClass(LearningProgress);

@Schema({ timestamps: true })
export class User {
  @Prop({
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  })
  name: string;

  @Prop({
    unique: true,
    required: true,
    validate: [isEmail, 'Некорректный email'],
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [LearningProgressSchema], default: [] })
  learningProgress: LearningProgress[];
}

export const UserSchema = SchemaFactory.createForClass(User);
