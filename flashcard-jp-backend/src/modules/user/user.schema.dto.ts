import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export enum LanguageCode {
  JP = 'jp',
  KR = 'kr',
}

export class LearningProgressItemDto {
  @IsMongoId()
  id: string;

  @IsNumber()
  weight: number;
}

export class LearningProgressDto {
  @IsEnum(LanguageCode)
  language: LanguageCode;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LearningProgressItemDto)
  hiragana?: LearningProgressItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LearningProgressItemDto)
  katakana?: LearningProgressItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LearningProgressItemDto)
  hangul?: LearningProgressItemDto[];
}

export class LoginUserDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @IsString()
  @IsNotEmpty()
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
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(2, {
    message: 'Минимальная длина поля "name" - 2',
  })
  @MaxLength(30, {
    message: 'Максимальная длина поля "name" - 30',
  })
  name: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(2, {
    message: 'Минимальная длина поля "name" - 2',
  })
  @MaxLength(30, {
    message: 'Максимальная длина поля "name" - 30',
  })
  name?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEmail({}, { message: 'Некорректный email' })
  email?: string;

  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
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

export class GetUserUsageDto {
  hanzi: number;
  wordCn: number;
  kanji: number;
  wordJp: number;
  wordKr: number;
}
