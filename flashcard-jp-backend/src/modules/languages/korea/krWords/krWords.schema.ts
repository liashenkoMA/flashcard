import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class WordKr {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  word: string;

  @Prop({ required: true })
  translate: string;

  @Prop({ required: true })
  category: string;

  @Prop({ default: 1 })
  weight: number;

  @Prop({ type: Object, default: {} })
  srs: Record<string, any>;
}

export const WordsKrSchema = SchemaFactory.createForClass(WordKr);

// Индексы
WordsKrSchema.index({ userId: 1 });
WordsKrSchema.index({ userId: 1, 'srs.nextReviewAt': 1 });
