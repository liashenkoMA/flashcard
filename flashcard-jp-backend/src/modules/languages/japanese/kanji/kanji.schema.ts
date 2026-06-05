import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Kanji {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User', index: true })
  userId: Types.ObjectId;

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
