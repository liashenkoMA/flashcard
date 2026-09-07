import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export type HiraganaGroup =
  | 'a'
  | 'k'
  | 's'
  | 't'
  | 'n'
  | 'h'
  | 'm'
  | 'y'
  | 'r'
  | 'w';

export type KanaType = 'base' | 'dakuten' | 'handakuten' | 'combo';

export class HiraganaDto {
  _id: string;
  symbol: string;
  romaji: string;
  group?: HiraganaGroup;
  type?: KanaType;
  baseSymbol?: string;
  isSmall?: boolean;
  learned: boolean;
  weight: number;
}

export class UpdateHiraganaDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;
}

export class UpdateHiraganaWeightDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsIn(['remember', 'forgot'])
  status: 'remember' | 'forgot';
}
