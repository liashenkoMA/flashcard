export class HanziDto {
  _id: string;
  category: string;
  hanzi: string;
  translate: string;
  pinyin: string;
  weight: number;
  srs?: any;
}

export class UpdateHanziWeightDto {
  hanziId: string;
  status: 'remember' | 'forgot';
}
