import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindAppointmentsDto {
  @ApiPropertyOptional({ example: 'clx2...', description: 'Фильтр по ID терапевта' })
  @IsOptional()
  @IsString()
  therapistId?: string;

  @ApiPropertyOptional({ example: 'clx1...', description: 'Фильтр по ID пациента' })
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiPropertyOptional({ enum: ['scheduled', 'completed', 'cancelled', 'no_show'], description: 'Фильтр по статусу' })
  @IsOptional()
  @IsIn(['scheduled', 'completed', 'cancelled', 'no_show'])
  status?: string;

  @ApiPropertyOptional({ example: '2026-06-01T00:00:00.000Z', description: 'Начало диапазона дат' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ example: '2026-06-30T23:59:59.000Z', description: 'Конец диапазона дат' })
  @IsOptional()
  @IsDateString()
  to?: string;
}
