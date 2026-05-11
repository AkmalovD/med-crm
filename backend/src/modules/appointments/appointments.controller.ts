import {Controller, Get} from "@nestjs/common";
import {AppointmentsService} from "./appointments.service";

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) {}

    @Get('total')
    getTotalAppointments() {
        return this.appointmentsService.getTotalAppointments()
    }
}