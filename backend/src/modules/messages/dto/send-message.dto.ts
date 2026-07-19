import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({ example: 'clx4...', description: 'ID беседы (CUID)' })
  @IsString()
  conversationId: string;

  @ApiProperty({ example: 'Здравствуйте, как дела?', description: 'Текст сообщения', minLength: 1 })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiPropertyOptional({example: 'clx5...', description: 'ID сообщенияб на которое отвечеам'})
  @IsOptional()
  @IsString()
  replyToId?: string 
}