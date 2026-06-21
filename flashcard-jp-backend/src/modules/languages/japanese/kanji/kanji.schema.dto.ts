export class KanjiDto {
  _id: string;
  kanji: string;
  translate: string;
  jpRead: string;
  chinaRead: string;
  weight: number;
  srs?: any;
}

export class UpdateKanjiWeightDto {
  kanjiId: string;
  status: 'remember' | 'forgot';
}
