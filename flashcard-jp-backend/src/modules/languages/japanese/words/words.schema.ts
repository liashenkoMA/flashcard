import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class WordJp {
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

export const WordsSchema = SchemaFactory.createForClass(WordJp);

// Индексы
WordsSchema.index({ userId: 1 });
WordsSchema.index({ userId: 1, 'srs.nextReviewAt': 1 });
