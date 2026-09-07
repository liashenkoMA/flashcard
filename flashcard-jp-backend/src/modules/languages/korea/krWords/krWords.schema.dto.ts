import { Transform } from 'class-transformer';
import { IsIn, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateWordKrDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  word: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  translate: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  category: string;
}

export class WordKrDto {
  _id: string;
  word: string;
  translate: string;
  category: string;
  weight: number;
  srs?: any;
}

export class UpdateWordKrWeightDto {
  @IsMongoId()
  wordId: string;

  @IsIn(['remember', 'forgot'])
  status: 'remember' | 'forgot';
}
