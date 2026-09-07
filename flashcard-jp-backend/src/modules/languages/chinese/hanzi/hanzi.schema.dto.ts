import { Transform } from 'class-transformer';
import { IsIn, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateHanziDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  category: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  hanzi: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  translate: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  pinyin: string;
}

export class HanziDto {
  _id: string;
  category: string;
  hanzi: string;
  translate: string;
  pinyin: string;
  weight: number;
  srs?: any;
}

export class UpdateHanziWeightDto {
  @IsMongoId()
  hanziId: string;

  @IsIn(['remember', 'forgot'])
  status: 'remember' | 'forgot';
}
