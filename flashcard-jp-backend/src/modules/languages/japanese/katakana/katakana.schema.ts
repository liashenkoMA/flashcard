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
  type: KanaType;

  @Prop()
  baseSymbol?: string;

  @Prop({ default: false })
  isSmall: boolean;
}

export const KatakanaSchema = SchemaFactory.createForClass(Katakana);
