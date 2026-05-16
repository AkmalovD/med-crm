import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
  const patients = await p.patient.findMany({ select: { id: true, fullName: true } });
  const therapists = await p.therapistProfile.findMany({ select: { id: true, fullName: true } });
  console.log('PATIENTS:' + JSON.stringify(patients));
  console.log('THERAPISTS:' + JSON.stringify(therapists));
  await p.$disconnect();
}
main().catch(console.error);
