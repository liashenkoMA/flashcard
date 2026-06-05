import { KanjiDto } from '../languages/japanese/kanji/kanji.schema.dto';
import { WordsDto } from '../languages/japanese/words/words.schema.dto';

export enum LanguageCode {
  JP = 'jp',
  CN = 'cn',
  KR = 'kr',
}

export class LearningProgressItemDto {
  id: string;
  weight: number;
}

export class LearningProgressDto {
  language: LanguageCode;
  kanji: KanjiDto[];
  words: WordsDto[];
  hiragana: LearningProgressItemDto[];
  katakana: LearningProgressItemDto[];
}

export class UserDto {
  name: string;
  email: string;
  learningProgress: LearningProgressDto[];
}

export class LoginUserDto {
  email: string;
  password: string;
}

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export class UpdateUserDto {
  name?: string;
  email?: string;
  currentPassword: string;
  newPassword?: string;
}

export class UserResponseDto {
  name: string;
  email: string;
}
