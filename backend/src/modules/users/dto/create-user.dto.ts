import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'therapist@clinic.com', description: 'Email пользователя', maxLength: 120 })
  @IsEmail()
  @MaxLength(120)
  email: string;

  @ApiProperty({ example: 'secret123', description: 'Пароль', minLength: 8, maxLength: 128 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @ApiPropertyOptional({ enum: UserRole, description: 'Роль пользователя (по умолчанию STAFF)' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}