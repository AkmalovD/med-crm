import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'clx1...', description: 'ID пациента (CUID)' })
  @IsString()
  patientId: string;

  @ApiProperty({ example: 'clx2...', description: 'ID терапевта (CUID)' })
  @IsString()
  therapistId: string;

  @ApiProperty({ example: '2026-06-10T09:00:00.000Z', description: 'Начало приёма (ISO 8601)' })
  @IsDateString()
  startAt: string;

  @ApiProperty({ example: '2026-06-10T10:00:00.000Z', description: 'Конец приёма (ISO 8601)' })
  @IsDateString()
  endAt: string;

  @ApiPropertyOptional({
    enum: ['scheduled', 'completed', 'cancelled', 'no_show'],
    description: 'Статус записи',
    default: 'scheduled',
  })
  @IsOptional()
  @IsIn(['scheduled', 'completed', 'cancelled', 'no_show'])
  status?: string;
}
