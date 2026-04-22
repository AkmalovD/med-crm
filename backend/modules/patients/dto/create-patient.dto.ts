import { IsDateString, IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePatientDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName: string

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string

  @IsOptional()
  @IsEmail()
  @MaxLength(120)
  email?: string

  @IsOptional()
  @IsDateString()
  birthDate?: string
}