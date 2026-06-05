import { IsDateString, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty({ example: 'Иванов Иван Иванович', description: 'ФИО пациента', minLength: 2, maxLength: 120 })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName: string;

  @ApiPropertyOptional({ example: '+998901234567', description: 'Телефон', maxLength: 30 })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ example: 'patient@example.com', description: 'Email пациента', maxLength: 120 })
  @IsOptional()
  @IsEmail()
  @MaxLength(120)
  email?: string;

  @ApiPropertyOptional({ example: '1990-05-20', description: 'Дата рождения (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;
}