export class WordKrDto {
  _id: string;
  word: string;
  translate: string;
  category?: string;
  weight: number;
  srs?: any;
}

export class UpdateWordKrWeightDto {
  wordId: string;
  status: 'remember' | 'forgot';
}
