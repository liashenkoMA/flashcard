export class WordDto {
  _id: string;
  word: string;
  translate: string;
  category?: string;
  weight: number;
  srs?: any;
}

export class UpdateWordWeightDto {
  wordId: string;
  status: 'remember' | 'forgot';
}
