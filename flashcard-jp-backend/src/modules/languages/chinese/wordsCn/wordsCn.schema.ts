import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class WordCn {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  word: string;

  @Prop({ required: true })
  pinyin: string;

  @Prop({ required: true })
  translate: string;

  @Prop({ required: true })
  category: string;

  @Prop({ default: 1 })
  weight: number;

  @Prop({ type: Object, default: {} })
  srs: Record<string, any>;
}

export const WordCnSchema = SchemaFactory.createForClass(WordCn);

// Индексы
WordCnSchema.index({ userId: 1 });
WordCnSchema.index({ userId: 1, 'srs.nextReviewAt': 1 });
