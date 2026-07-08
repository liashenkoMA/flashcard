export class HangeulDto {
  _id: string;
  symbol: string;
  romaji: string;
  group?:
    | 'basic-consonant'
    | 'double-consonant'
    | 'basic-vowel'
    | 'compound-vowel';
  learned?: boolean;
}

export class UpdateHangeulDto {
  symbol: string;
}

export class UpdateHangeulWeightDto {
  symbol: string;
  status: 'remember' | 'forgot';
}
