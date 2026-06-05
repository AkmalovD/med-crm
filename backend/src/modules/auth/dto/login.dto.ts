import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@clinic.com', description: 'Email пользователя' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret123', description: 'Пароль (минимум 8 символов)', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}