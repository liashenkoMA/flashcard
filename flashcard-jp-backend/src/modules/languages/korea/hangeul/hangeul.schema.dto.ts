import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export type HangeulType =
  | 'basic-consonant'
  | 'double-consonant'
  | 'basic-vowel'
  | 'compound-vowel';

export class HangeulDto {
  _id: string;
  symbol: string;
  romaji: string;
  group: HangeulType;
  learned: boolean;
  weight: number;
}

export class UpdateHangeulDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;
}

export class UpdateHangeulWeightDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsIn(['remember', 'forgot'])
  status: 'remember' | 'forgot';
}
