import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConverstionDto {
  @ApiProperty({ example: 'clx3...', description: 'ID второго участника беседы (CUID)' })
  @IsString()
  participantId: string;
}