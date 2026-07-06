export class KanjiDto {
  _id: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
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
