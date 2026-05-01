import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTotalSessions(): Promise<{ total: number }> {
    const total = await this.prisma.appointment.count();

    return { total };
  }
}
