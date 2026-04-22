import { Body, Controller, Post } from "@nestjs/common";
import { PatientService } from "./patients.service";
import { CreatePatientDto } from "./dto/create-patient.dto";

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  create(@Body() CreatePatientDto: CreatePatientDto) {
    return this.patientService.create(CreatePatientDto)
  }
}