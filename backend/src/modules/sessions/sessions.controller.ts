import { Controller, Get } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Sessions')
@ApiBearerAuth('access-token')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get('total')
  @ApiOperation({ summary: 'Получить общее количество сессий' })
  @ApiResponse({ status: 200, description: 'Количество сессий' })
  getTotalSessions() {
    return this.sessionsService.getTotalSessions();
  }
}
