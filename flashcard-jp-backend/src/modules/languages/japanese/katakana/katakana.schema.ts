import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type KanaType = 'base' | 'dakuten' | 'handakuten' | 'combo';

@Schema()
export class Katakana {
  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true })
  romaji: string;

  @Prop({
    enum: ['a', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w'],
    required: false,
  })
  group?: string;

  @Prop({
    enum: ['base', 'dakuten', 'handakuten', 'combo'],
    default: 'base',
  })
  type?: KanaType;

  @Prop()
  baseSymbol?: string;

  @Prop({ required: false })
  isSmall?: boolean;

  @Prop({
    default: 0,
    min: 0,
  })
  weight: number;
}

export const KatakanaSchema = SchemaFactory.createForClass(Katakana);
