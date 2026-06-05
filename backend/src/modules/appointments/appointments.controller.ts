import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { FindAppointmentsDto } from './dto/find-appointments.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Appointments')
@ApiBearerAuth('access-token')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать запись на приём' })
  @ApiResponse({ status: 201, description: 'Запись создана' })
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список записей с фильтрами' })
  @ApiResponse({ status: 200, description: 'Список записей на приём' })
  findAll(@Query() filters: FindAppointmentsDto) {
    return this.appointmentsService.findAll(filters);
  }

  @Get('total')
  @ApiOperation({ summary: 'Получить общее количество записей' })
  @ApiResponse({ status: 200, description: 'Количество записей' })
  getTotalAppointments() {
    return this.appointmentsService.getTotalAppointments();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить запись по ID' })
  @ApiParam({ name: 'id', description: 'CUID записи' })
  @ApiResponse({ status: 200, description: 'Запись найдена' })
  @ApiResponse({ status: 404, description: 'Не найдена' })
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить запись на приём' })
  @ApiParam({ name: 'id', description: 'CUID записи' })
  @ApiResponse({ status: 200, description: 'Запись обновлена' })
  update(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    return this.appointmentsService.update(id, dto);
  }

  @Roles(UserRole.ADMIN, UserRole.THERAPIST)
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить запись (ADMIN или THERAPIST)' })
  @ApiParam({ name: 'id', description: 'CUID записи' })
  @ApiResponse({ status: 200, description: 'Запись удалена' })
  @ApiResponse({ status: 403, description: 'Нет прав' })
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
