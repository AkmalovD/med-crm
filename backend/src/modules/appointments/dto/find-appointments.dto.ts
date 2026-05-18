import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

export class FindAppointmentsDto {
  @IsOptional()
  @IsString()
  therapistId?: string;

  @IsOptional()
  @IsString()
  patientId?: string;

  @IsOptional()
  @IsIn(['scheduled', 'completed', 'cancelled', 'no_show'])
  status?: string;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
