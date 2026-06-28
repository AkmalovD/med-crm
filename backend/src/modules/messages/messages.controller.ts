import {Body, Controller, Get, Param, Patch, Post} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateConverstionDto } from './dto/create-converstion.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import {ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam} from '@nestjs/swagger';
import {SendMessageDto} from "./dto/send-message.dto";

@ApiTags('Messages')
@ApiBearerAuth('access-token')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversations')
  @ApiOperation({ summary: "Получить список всех бесед текущего пользователя" })
  getMyConversation(@CurrentUser() user: JwtPayload)
  {
      return this.messagesService.getMyConversations((user.sub))
  }

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

  @Get('conversation/:id/messages')
  @ApiOperation({ summary: "Получить сообщение из конкретного диалога" })
  @ApiParam({ name: 'id', description: 'ID Диалога'})
  getMessages(
      @CurrentUser() user: JwtPayload,
      @Param('id') conversationId: string,
  )  {
      return this.messagesService.getMessages(user.sub, conversationId)
  }

  @Post('message')
  @ApiOperation({ summary: 'Отправить новое сообщение в диаолог'})
  sendMessage(
      @CurrentUser() user: JwtPayload,
      @Body() dto: SendMessageDto,
  )  {
      return this.messagesService.sendMessage(user.sub, dto)
  }

  @Patch('conversations/:id/read')
  @ApiOperation({ summary: 'Пометить сообщения в диалоге как прочитанные' })
  @ApiParam({ name: 'id', description: 'ID' })
  markAsRead(
      @CurrentUser() user: JwtPayload,
      @Param('id') conversationId: string
  )  {
      return this.messagesService.markAsRead(user.sub, conversationId)
  }
}
