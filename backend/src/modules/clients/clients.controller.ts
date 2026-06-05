import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Clients')
@ApiBearerAuth('access-token')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать клиента' })
  @ApiResponse({ status: 201, description: 'Клиент создан' })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список всех клиентов' })
  @ApiResponse({ status: 200, description: 'Список клиентов' })
  findAll() {
    return this.clientsService.findAll();
  }

  @Get('total')
  @ApiOperation({ summary: 'Получить общее количество клиентов' })
  @ApiResponse({ status: 200, description: 'Количество клиентов' })
  getTotal() {
    return this.clientsService.getTotal();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить клиента по ID' })
  @ApiParam({ name: 'id', description: 'CUID клиента' })
  @ApiResponse({ status: 200, description: 'Клиент найден' })
  @ApiResponse({ status: 404, description: 'Не найден' })
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить данные клиента' })
  @ApiParam({ name: 'id', description: 'CUID клиента' })
  @ApiResponse({ status: 200, description: 'Клиент обновлён' })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Roles(UserRole.ADMIN, UserRole.THERAPIST)
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить клиента (ADMIN или THERAPIST)' })
  @ApiParam({ name: 'id', description: 'CUID клиента' })
  @ApiResponse({ status: 200, description: 'Клиент удалён' })
  @ApiResponse({ status: 403, description: 'Нет прав' })
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
