import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Ensure we have therapists
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

  // Ensure we have patients
  const patientData = [
    { fullName: 'Анвар Исмоилов', phone: '+998901110001' },
    { fullName: 'Сабина Орипова', phone: '+998901110002' },
    { fullName: 'Мухаммад Содиков', phone: '+998901110003' },
    { fullName: 'Гулбахор Тошева', phone: '+998901110004' },
    { fullName: 'Рустам Назаров', phone: '+998901110005' },
  ];

  const patients: { id: string }[] = [];

  for (const pt of patientData) {
    let existing = await prisma.patient.findFirst({ where: { phone: pt.phone } });
    if (!existing) {
      existing = await prisma.patient.create({ data: pt });
    }
    patients.push({ id: existing.id });
  }

  console.log(`Therapists: ${therapistProfiles.length}, Patients: ${patients.length}`);

  const now = new Date();

  const slots = [
    { dayOffset: -7, hour: 9,  duration: 1, pIdx: 0, tIdx: 0, status: 'completed' },
    { dayOffset: -5, hour: 11, duration: 1, pIdx: 1, tIdx: 1, status: 'completed' },
    { dayOffset: -3, hour: 14, duration: 2, pIdx: 2, tIdx: 2, status: 'cancelled' },
    { dayOffset: -2, hour: 10, duration: 1, pIdx: 3, tIdx: 0, status: 'no_show' },
    { dayOffset: -1, hour: 16, duration: 1, pIdx: 4, tIdx: 1, status: 'completed' },
    { dayOffset:  0, hour: 9,  duration: 1, pIdx: 0, tIdx: 2, status: 'scheduled' },
    { dayOffset:  0, hour: 13, duration: 1, pIdx: 1, tIdx: 0, status: 'scheduled' },
    { dayOffset:  1, hour: 10, duration: 2, pIdx: 2, tIdx: 1, status: 'scheduled' },
    { dayOffset:  3, hour: 14, duration: 1, pIdx: 3, tIdx: 2, status: 'scheduled' },
    { dayOffset:  5, hour: 11, duration: 1, pIdx: 4, tIdx: 0, status: 'scheduled' },
  ];

  let created = 0;

  for (const s of slots) {
    const startAt = new Date(now);
    startAt.setDate(startAt.getDate() + s.dayOffset);
    startAt.setHours(s.hour, 0, 0, 0);

    const endAt = new Date(startAt);
    endAt.setHours(endAt.getHours() + s.duration);

    await prisma.appointment.create({
      data: {
        patientId: patients[s.pIdx].id,
        therapistId: therapistProfiles[s.tIdx].id,
        startAt,
        endAt,
        status: s.status,
      },
    });
    created++;
  }

  console.log(`Done! ${created} appointments created.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
