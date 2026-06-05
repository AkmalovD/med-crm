import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateClientDto {
  @ApiPropertyOptional({ example: 'ООО Здоровье', minLength: 2, maxLength: 120 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName?: string;

  @ApiPropertyOptional({ example: 'client@org.com', maxLength: 120 })
  @IsOptional()
  @IsEmail()
  @MaxLength(120)
  email?: string;

  @ApiPropertyOptional({ example: '+998901234567', maxLength: 10 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  number?: string;

  @ApiPropertyOptional({ example: 'ООО Медика', maxLength: 120 })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  organization?: string;

  @ApiPropertyOptional({ example: 'г. Ташкент', maxLength: 120 })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  address?: string;

  @ApiPropertyOptional({ example: 'active', description: 'Статус клиента' })
  @IsOptional()
  @IsString()
  status?: string;
}
