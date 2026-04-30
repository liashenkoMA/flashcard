export class KatakanaDto {
  _id: string;
  symbol: string;
  romaji: string;

  group?: string;
  type: 'base' | 'dakuten' | 'handakuten' | 'combo';
  isSmall: boolean;
  baseSymbol?: string;

  learned?: boolean;
}
