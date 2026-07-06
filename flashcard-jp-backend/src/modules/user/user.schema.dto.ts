export enum LanguageCode {
  JP = 'jp',
  KR = 'kr',
}

export class LearningProgressItemDto {
  id: string;
  weight: number;
}

export class LearningProgressDto {
  language: LanguageCode;
  hiragana?: LearningProgressItemDto[];
  katakana?: LearningProgressItemDto[];
  hangul?: LearningProgressItemDto[];
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
