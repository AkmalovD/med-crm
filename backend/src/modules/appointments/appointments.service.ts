import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAppointmentDto) {
    return this.prisma.appointment.create({
      data: {
        patientId: dto.patientId,
        therapistId: dto.therapistId,
        startAt: new Date(dto.startAt),
        endAt: new Date(dto.endAt),
        status: dto.status ?? 'scheduled',
      },
      include: { patient: true, therapist: true },
    });
  }

  async findAll() {
    return this.prisma.appointment.findMany({
      orderBy: { startAt: 'desc' },
      include: { patient: true, therapist: true },
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { patient: true, therapist: true, notes: true },
    });
    if (!appointment) throw new NotFoundException(`Appointment ${id} not found`);
    return appointment;
  }

  async update(id: string, dto: UpdateAppointmentDto) {
    await this.findOne(id);
    return this.prisma.appointment.update({
      where: { id },
      data: {
        ...(dto.patientId && { patientId: dto.patientId }),
        ...(dto.therapistId && { therapistId: dto.therapistId }),
        ...(dto.startAt && { startAt: new Date(dto.startAt) }),
        ...(dto.endAt && { endAt: new Date(dto.endAt) }),
        ...(dto.status && { status: dto.status }),
      },
      include: { patient: true, therapist: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.appointment.delete({ where: { id } });
  }

  async getTotalAppointments(): Promise<{ total: number }> {
    const total = await this.prisma.appointment.count();
    return { total };
  }
}
