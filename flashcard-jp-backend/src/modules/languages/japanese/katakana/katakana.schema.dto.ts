import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export type KatakanaGroup =
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

export class KatakanaDto {
  _id: string;
  symbol: string;
  romaji: string;
  group?: KatakanaGroup;
  type?: KanaType;
  baseSymbol?: string;
  isSmall?: boolean;
  learned: boolean;
  weight: number;
}

export class UpdateKatakanaDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;
}

export class UpdateKatakanaWeightDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsIn(['remember', 'forgot'])
  status: 'remember' | 'forgot';
}
