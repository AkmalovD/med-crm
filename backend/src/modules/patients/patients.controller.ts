import { Body, Controller, Get, Post } from '@nestjs/common';
import { PatientService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Patients')
@ApiBearerAuth('access-token')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @ApiOperation({ summary: 'Создать пациента' })
  @ApiResponse({ status: 201, description: 'Пациент создан' })
  create(@Body() CreatePatientDto: CreatePatientDto) {
    return this.patientService.create(CreatePatientDto);
  }

  @Get('total')
  @ApiOperation({ summary: 'Получить общее количество пациентов' })
  @ApiResponse({ status: 200, description: 'Количество пациентов' })
  getTotalPatients() {
    return this.patientService.getTotalPatients();
  }
}