import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type AppointmentCounterClient = {
  appointment: {
    count: () => Promise<number>;
  };
};

@Injectable()
export class SessionsService {
  constructor(
    private readonly prisma: PrismaService & AppointmentCounterClient,
  ) {}

  async getTotalSessions(): Promise<{ total: number }> {
    const total = await this.prisma.appointment.count();

    return { total };
  }
}
