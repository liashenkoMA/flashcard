import { Transform } from 'class-transformer';
import { IsEnum, IsIn, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export enum KanjiLevel {
  N5 = 'N5',
  N4 = 'N4',
  N3 = 'N3',
  N2 = 'N2',
  N1 = 'N1',
}

export class CreateKanjiDto {
  @IsEnum(KanjiLevel)
  level: KanjiLevel;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  kanji: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  translate: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  jpRead: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  chinaRead: string;
}

export class KanjiDto {
  _id: string;
  level: KanjiLevel;
  kanji: string;
  translate: string;
  jpRead: string;
  chinaRead: string;
  weight: number;
  srs?: any;
}

export class UpdateKanjiWeightDto {
  @IsMongoId()
  kanjiId: string;

  @IsIn(['remember', 'forgot'])
  status: 'remember' | 'forgot';
}
