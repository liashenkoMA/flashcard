import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Kanji {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['N5', 'N4', 'N3', 'N2', 'N1'],
    required: true,
  })
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

  @Prop({ required: true })
  kanji: string;

  @Prop({ required: true })
  translate: string;

  @Prop({ required: true })
  jpRead: string;

  @Prop({ required: true })
  chinaRead: string;

  @Prop({ default: 1 })
  weight: number;

  @Prop({ type: Object, default: {} })
  srs: Record<string, any>;
}

export const KanjiSchema = SchemaFactory.createForClass(Kanji);

// Индексы
KanjiSchema.index({ userId: 1 });
KanjiSchema.index({ userId: 1, level: 1 });
KanjiSchema.index({ userId: 1, 'srs.nextReviewAt': 1 });
