import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Kanji {}
export const KanjiSchema = SchemaFactory.createForClass(Kanji);
