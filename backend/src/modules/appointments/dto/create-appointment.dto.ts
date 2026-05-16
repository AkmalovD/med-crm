import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  patientId: string;

  @IsString()
  therapistId: string;

  @IsDateString()
  startAt: string;

  @IsDateString()
  endAt: string;

  @IsOptional()
  @IsIn(['scheduled', 'completed', 'cancelled', 'no_show'])
  status?: string;
}
