import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating therapists...');

  const therapistData = [
    { email: 'therapist1@clinic.uz', fullName: 'Камола Рашидова', specialty: 'Психотерапия' },
    { email: 'therapist2@clinic.uz', fullName: 'Бахром Алимов', specialty: 'Неврология' },
    { email: 'therapist3@clinic.uz', fullName: 'Шахло Юсупова', specialty: 'Кардиология' },
  ];

  const therapistProfiles: { id: string }[] = [];

  for (const t of therapistData) {
    const hashed = await bcrypt.hash('Password123!', 10);
    const user = await prisma.user.upsert({
      where: { email: t.email },
      update: {},
      create: { email: t.email, password: hashed, role: 'THERAPIST' },
    });
    const profile = await prisma.therapistProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, fullName: t.fullName, specialty: t.specialty },
    });
    therapistProfiles.push({ id: profile.id });
  }

  console.log(`Created ${therapistProfiles.length} therapists`);

  console.log('Creating patients...');

  const patientData = [
    { fullName: 'Анвар Исмоилов', phone: '+998901110001', email: 'anvar@mail.ru', birthDate: new Date('1985-03-14') },
    { fullName: 'Сабина Орипова', phone: '+998901110002', email: 'sabina@mail.ru', birthDate: new Date('1992-07-22') },
    { fullName: 'Мухаммад Содиков', phone: '+998901110003', email: null, birthDate: new Date('1978-11-05') },
    { fullName: 'Гулбахор Тошева', phone: '+998901110004', email: 'gulbahor@gmail.com', birthDate: new Date('2000-01-30') },
    { fullName: 'Рустам Назаров', phone: '+998901110005', email: null, birthDate: new Date('1990-09-18') },
    { fullName: 'Зарина Холова', phone: '+998901110006', email: 'zarina@yandex.ru', birthDate: new Date('1995-04-11') },
    { fullName: 'Дониёр Умаров', phone: '+998901110007', email: null, birthDate: new Date('1988-06-25') },
  ];

  const patients: { id: string }[] = [];

  for (const pt of patientData) {
    const existing = await prisma.patient.findFirst({ where: { phone: pt.phone } });
    if (existing) {
      patients.push({ id: existing.id });
    } else {
      const created = await prisma.patient.create({ data: pt });
      patients.push({ id: created.id });
    }
  }

  // Also grab the 2 existing patients
  const existing = await prisma.patient.findMany({ select: { id: true } });
  const allPatientIds = [...new Set(existing.map((p) => p.id))];

  console.log(`Total patients available: ${allPatientIds.length}`);

  console.log('Creating 20 appointments...');

  const statuses = ['scheduled', 'completed', 'cancelled', 'no_show'];

  const appointments = [
    { dayOffset: -14, hour: 9,  duration: 1, patientIdx: 0, therapistIdx: 0, status: 'completed' },
    { dayOffset: -13, hour: 11, duration: 1, patientIdx: 1, therapistIdx: 1, status: 'completed' },
    { dayOffset: -12, hour: 14, duration: 2, patientIdx: 2, therapistIdx: 2, status: 'completed' },
    { dayOffset: -10, hour: 10, duration: 1, patientIdx: 3, therapistIdx: 0, status: 'no_show' },
    { dayOffset: -9,  hour: 16, duration: 1, patientIdx: 4, therapistIdx: 1, status: 'completed' },
    { dayOffset: -7,  hour: 9,  duration: 2, patientIdx: 5, therapistIdx: 2, status: 'cancelled' },
    { dayOffset: -6,  hour: 13, duration: 1, patientIdx: 6, therapistIdx: 0, status: 'completed' },
    { dayOffset: -5,  hour: 15, duration: 1, patientIdx: 0, therapistIdx: 1, status: 'completed' },
    { dayOffset: -4,  hour: 10, duration: 1, patientIdx: 1, therapistIdx: 2, status: 'no_show' },
    { dayOffset: -3,  hour: 11, duration: 2, patientIdx: 2, therapistIdx: 0, status: 'completed' },
    { dayOffset: -2,  hour: 14, duration: 1, patientIdx: 3, therapistIdx: 1, status: 'completed' },
    { dayOffset: -1,  hour: 9,  duration: 1, patientIdx: 4, therapistIdx: 2, status: 'cancelled' },
    { dayOffset:  0,  hour: 10, duration: 1, patientIdx: 5, therapistIdx: 0, status: 'scheduled' },
    { dayOffset:  0,  hour: 13, duration: 1, patientIdx: 6, therapistIdx: 1, status: 'scheduled' },
    { dayOffset:  1,  hour: 9,  duration: 2, patientIdx: 0, therapistIdx: 2, status: 'scheduled' },
    { dayOffset:  2,  hour: 11, duration: 1, patientIdx: 1, therapistIdx: 0, status: 'scheduled' },
    { dayOffset:  3,  hour: 14, duration: 1, patientIdx: 2, therapistIdx: 1, status: 'scheduled' },
    { dayOffset:  4,  hour: 10, duration: 2, patientIdx: 3, therapistIdx: 2, status: 'scheduled' },
    { dayOffset:  5,  hour: 15, duration: 1, patientIdx: 4, therapistIdx: 0, status: 'scheduled' },
    { dayOffset:  7,  hour: 9,  duration: 1, patientIdx: 5, therapistIdx: 1, status: 'scheduled' },
  ];

  const now = new Date();

  for (const a of appointments) {
    const startAt = new Date(now);
    startAt.setDate(startAt.getDate() + a.dayOffset);
    startAt.setHours(a.hour, 0, 0, 0);

    const endAt = new Date(startAt);
    endAt.setHours(endAt.getHours() + a.duration);

    const patientId = allPatientIds[a.patientIdx % allPatientIds.length];
    const therapistId = therapistProfiles[a.therapistIdx].id;

    await prisma.appointment.create({
      data: { patientId, therapistId, startAt, endAt, status: a.status },
    });
  }

  console.log('Done! 20 appointments seeded.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
