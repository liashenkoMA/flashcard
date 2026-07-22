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

export class LoginUserDto {
  email: string;
  password: string;
}

export class UserResponseDto {
  name: string;
  email: string;
  subscription: SubscriptionResponseDto;
}

export class LoginResponseDto {
  access_token: string;
  user: UserResponseDto;
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

export class UpdateUserResponseDto {
  name: string;
  email: string;
}

export class SubscriptionResponseDto {
  active: boolean;
  expiresAt: Date | null;
}

export class GetUserResponseDto {
  name: string;
  email: string;
  subscription: SubscriptionResponseDto;
}
