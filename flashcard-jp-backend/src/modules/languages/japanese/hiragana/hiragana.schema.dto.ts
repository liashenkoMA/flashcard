export class HiraganaDto {
  _id: string;
  symbol: string;
  romaji: string;
  group?: 'a' | 'k' | 's' | 't' | 'n' | 'h' | 'm' | 'y' | 'r' | 'w';
  type?: 'dakuten' | 'handakuten' | 'combo';
  isSmall?: boolean;
  learned?: boolean;
}

export class UpdateHiraganaDto {
  symbol: string;
}
