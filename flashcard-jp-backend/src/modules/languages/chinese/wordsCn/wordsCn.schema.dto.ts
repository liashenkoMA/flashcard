export class WordCnDto {
  _id: string;
  word: string;
  translate: string;
  pinyin: string;
  category?: string;
  weight: number;
  srs?: any;
}

export class UpdateWordCnWeightDto {
  wordId: string;
  status: 'remember' | 'forgot';
}
