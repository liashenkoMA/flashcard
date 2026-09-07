import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Hanzi {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ trim: true, required: true })
  category: string;

  @Prop({ trim: true, required: true })
  hanzi: string;

  @Prop({ trim: true, required: true })
  translate: string;

  @Prop({ trim: true, required: true })
  pinyin: string;

  @Prop({ default: 1 })
  weight: number;

  @Prop({ type: Object, default: {} })
  srs: Record<string, any>;
}

export const HanziSchema = SchemaFactory.createForClass(Hanzi);

// Индексы
HanziSchema.index({ userId: 1 });
HanziSchema.index({ userId: 1, level: 1 });
HanziSchema.index({ userId: 1, 'srs.nextReviewAt': 1 });
