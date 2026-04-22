import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePatientDto } from "./dto/create-patient.dto";

type PatientRecord = {
  fullName: string;
  phone: string | null;
  email: string | null;
  birthDate: Date | null;
} & Record<string, unknown>;

@Injectable()
export class PatientService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPatientDto: CreatePatientDto): Promise<PatientRecord> {
    const patientDelegate = (this.prisma as unknown as {
      patient: {
        create: (args: {
          data: {
            fullName: string;
            phone: string | null;
            email: string | null;
            birthDate: Date | null;
          };
        }) => Promise<PatientRecord>;
      };
    }).patient

    const patient = await patientDelegate.create({
      data: {
        fullName: createPatientDto.fullName,
        phone: createPatientDto.phone ?? null,
        email: createPatientDto.email ?? null,
        birthDate: createPatientDto.birthDate
          ? new Date(createPatientDto.birthDate)
          : null,
      }
    })

    return patient
  }
}