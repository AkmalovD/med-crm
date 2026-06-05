import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ example: 'ООО Здоровье', description: 'Полное имя / название клиента', minLength: 2, maxLength: 120 })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName: string;

  @ApiProperty({ example: 'client@org.com', description: 'Email клиента', maxLength: 120 })
  @IsEmail()
  @MaxLength(120)
  email: string;

  @ApiProperty({ example: '+998901234567', description: 'Телефон', minLength: 1, maxLength: 10 })
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  number: string;

  @ApiPropertyOptional({ example: 'ООО Медика', description: 'Организация', maxLength: 120 })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  organization?: string;

  @ApiPropertyOptional({ example: 'г. Ташкент, ул. Мустакиллик 1', description: 'Адрес', maxLength: 120 })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  address?: string;
}