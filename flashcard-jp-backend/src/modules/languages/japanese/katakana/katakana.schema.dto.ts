export class KatakanaDto {
  _id: string;
  symbol: string;
  romaji: string;
  group?: 'a' | 'k' | 's' | 't' | 'n' | 'h' | 'm' | 'y' | 'r' | 'w';
  type?: 'dakuten' | 'handakuten' | 'combo';
  isSmall?: boolean;
  learned?: boolean;
}

export class UpdateKatakanaDto {
  symbol: string;
}

export class UpdateKatakanaWeightDto {
  symbol: string;
  status: 'remember' | 'forgot';
}
