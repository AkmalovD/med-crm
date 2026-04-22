import { Module } from "@nestjs/common";
import { PatientsController } from "./patients.controller";
import { PatientService } from "./patients.service";

@Module({
  controllers: [PatientsController],
  providers: [PatientService],
})
export class PatientModule {}