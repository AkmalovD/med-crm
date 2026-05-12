import {IsEmail, IsString, MaxLength, MinLength} from "class-validator";

export class CreateClientDto {
    @IsString()
    @MinLength(2)
    @MaxLength(120)
    fullName: string

    @IsEmail()
    @MaxLength(120)
    email: string

    @IsString()
    @MinLength(1)
    @MaxLength(10)
    number: string

    @IsString()
    @MinLength(1)
    @MaxLength(120)
    organization?: string

    @IsString()
    @MinLength(2)
    @MaxLength(120)
    address?: string
}