import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type HangeulType =
  | 'basic-consonant'
  | 'double-consonant'
  | 'basic-vowel'
  | 'compound-vowel';

@Schema()
export class Hangeul {
  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true })
  romaji: string;

  @Prop({
    enum: [
      'basic-consonant',
      'double-consonant',
      'basic-vowel',
      'compound-vowel',
    ],
    required: true,
  })
  group: HangeulType;

  @Prop({
    default: 0,
    min: 0,
  })
  weight: number;
}

export const HangeulSchema = SchemaFactory.createForClass(Hangeul);
