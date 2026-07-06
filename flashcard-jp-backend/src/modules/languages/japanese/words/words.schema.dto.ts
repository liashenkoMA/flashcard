export class WordJpDto {
  _id: string;
  word: string;
  translate: string;
  category?: string;
  weight: number;
  srs?: any;
}

export class UpdateWordJpWeightDto {
  wordId: string;
  status: 'remember' | 'forgot';
}
