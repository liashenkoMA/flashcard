import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Words {}
export const WordsSchema = SchemaFactory.createForClass(Words);
