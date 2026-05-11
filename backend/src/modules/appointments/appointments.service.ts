import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class AppointmentsService {
    constructor(private readonly prisma: PrismaService) {}

    async getTotalAppointments(): Promise<{ total: number }> {
        const total = await this.prisma.appointment.count()

        return { total }
    }
}