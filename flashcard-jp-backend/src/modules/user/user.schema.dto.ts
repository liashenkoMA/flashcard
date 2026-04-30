import { HiraganaDto } from '../languages/japanese/hiragana/hiragana.schema.dto';
import { KanjiDto } from '../languages/japanese/kanji/kanji.schema.dto';
import { KatakanaDto } from '../languages/japanese/katakana/katakana.schema.dto';
import { WordsDto } from '../languages/japanese/words/words.schema.dto';

export enum languageCode {
  JP = 'jp',
  CN = 'cn',
}

export class LearningProgressDto {
  language: languageCode;
  kanji: KanjiDto[];
  words: WordsDto[];
  hiragana: HiraganaDto[];
  katakana: KatakanaDto[];
}

export class UserDto {
  name: string;
  email: string;
  password: string;
  learningProgress: LearningProgressDto[];
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
