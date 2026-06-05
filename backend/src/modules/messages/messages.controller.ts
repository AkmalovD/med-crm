import { Body, Controller, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateConverstionDto } from './dto/create-converstion.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Messages')
@ApiBearerAuth('access-token')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('conversations')
  @ApiOperation({ summary: 'Создать или получить беседу с пользователем' })
  @ApiResponse({ status: 201, description: 'Беседа возвращена или создана' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  getOrCreateConversation(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateConverstionDto,
  ) {
    return this.messagesService.getOrCreateConversation(user.sub, dto);
  }
}
