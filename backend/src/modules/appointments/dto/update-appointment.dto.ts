import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAppointmentDto {
  @ApiPropertyOptional({ example: 'clx1...', description: 'ID пациента' })
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiPropertyOptional({ example: 'clx2...', description: 'ID терапевта' })
  @IsOptional()
  @IsString()
  therapistId?: string;

  @ApiPropertyOptional({ example: '2026-06-10T09:00:00.000Z', description: 'Начало приёма' })
  @IsOptional()
  @IsDateString()
  startAt?: string;

  @ApiPropertyOptional({ example: '2026-06-10T10:00:00.000Z', description: 'Конец приёма' })
  @IsOptional()
  @IsDateString()
  endAt?: string;

  @ApiPropertyOptional({ enum: ['scheduled', 'completed', 'cancelled', 'no_show'], description: 'Статус записи' })
  @IsOptional()
  @IsIn(['scheduled', 'completed', 'cancelled', 'no_show'])
  status?: string;
}
