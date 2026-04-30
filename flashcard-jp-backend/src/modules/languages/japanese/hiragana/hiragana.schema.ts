import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type KanaType = 'base' | 'dakuten' | 'handakuten' | 'combo';

@Schema()
export class Hiragana {
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
    enum: ['dakuten', 'handakuten', 'combo'],
    required: false,
  })
  type?: KanaType;

  @Prop({ required: false })
  isSmall?: boolean;
}

export const HiraganaSchema = SchemaFactory.createForClass(Hiragana);
