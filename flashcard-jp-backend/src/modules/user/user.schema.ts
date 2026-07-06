import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { isEmail } from 'validator';

export type LanguageCode = 'jp' | 'kr';

@Schema({ _id: false })
export class LearningProgressItem {
  @Prop({ type: Types.ObjectId, required: true })
  id: Types.ObjectId;

  @Prop({ default: 1 })
  weight: number;
}

export const LearningProgressItemSchema =
  SchemaFactory.createForClass(LearningProgressItem);

@Schema({ _id: false })
export class LearningProgress {
  @Prop({
    required: true,
    enum: ['jp', 'kr'],
  })
  language: LanguageCode;

  @Prop({ type: [LearningProgressItemSchema], default: undefined })
  hiragana?: LearningProgressItem[];

  @Prop({ type: [LearningProgressItemSchema], default: undefined })
  katakana?: LearningProgressItem[];

  @Prop({ type: [LearningProgressItemSchema], default: undefined })
  hangul?: LearningProgressItem[];
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
