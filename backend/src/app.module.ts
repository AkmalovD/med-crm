import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { PrismaModule } from './prisma/prisma.module';
import { PatientModule } from 'src/modules/patients/patients.module';
import { ClientsModule } from './modules/clients/clients.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    AuthModule,
    UsersModule,
    HealthModule,
    PrismaModule,
    SessionsModule,
    PatientModule,
    ClientsModule,
    AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
