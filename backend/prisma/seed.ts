import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const clients = [
  {
    fullName: 'Алишер Каримов',
    email: 'alisher.karimov@gmail.com',
    number: '+998901234501',
    organization: 'МЧС Узбекистана',
    address: 'г. Ташкент, ул. Навои, 12',
    status: 'active',
  },
  {
    fullName: 'Малика Юсупова',
    email: 'malika.yusupova@mail.ru',
    number: '+998901234502',
    organization: 'Городская больница №1',
    address: 'г. Самарканд, ул. Регистан, 5',
    status: 'active',
  },
  {
    fullName: 'Бобур Рашидов',
    email: 'bobur.rashidov@yandex.ru',
    number: '+998901234503',
    organization: 'ООО "Агрофарм"',
    address: 'г. Фергана, ул. Мустакиллик, 88',
    status: 'active',
  },
  {
    fullName: 'Нилуфар Хасанова',
    email: 'nilufar.xasanova@outlook.com',
    number: '+998901234504',
    organization: 'Республиканский детский центр',
    address: 'г. Ташкент, ул. Чиланзар, 3а',
    status: 'active',
  },
  {
    fullName: 'Жасур Эргашев',
    email: 'jasur.ergashev@gmail.com',
    number: '+998901234505',
    organization: 'ИП Эргашев',
    address: 'г. Андижан, ул. Беруний, 22',
    status: 'inactive',
  },
  {
    fullName: 'Дилноза Мирзаева',
    email: 'dilnoza.mirzaeva@gmail.com',
    number: '+998901234506',
    organization: 'Клиника "Шифо"',
    address: 'г. Наманган, пр. Ислом Каримов, 10',
    status: 'active',
  },
  {
    fullName: 'Санжар Турсунов',
    email: 'sanjhar.tursunov@mail.ru',
    number: '+998901234507',
    organization: 'АО "Узтелеком"',
    address: 'г. Ташкент, ул. Амир Темур, 55',
    status: 'active',
  },
  {
    fullName: 'Феруза Абдуллаева',
    email: 'feruza.abdullaeva@gmail.com',
    number: '+998901234508',
    organization: null,
    address: 'г. Бухара, ул. Хаётхон, 7',
    status: 'active',
  },
  {
    fullName: 'Отабек Норматов',
    email: 'otabek.normatov@yandex.ru',
    number: '+998901234509',
    organization: 'Строительная компания "Буньёд"',
    address: 'г. Ташкент, Юнусабад, 19-квартал',
    status: 'active',
  },
  {
    fullName: 'Зулфия Сайдалиева',
    email: 'zulfiya.saydaliyeva@outlook.com',
    number: '+998901234510',
    organization: 'Школа №47',
    address: 'г. Ташкент, ул. Себзор, 14',
    status: 'inactive',
  },
  {
    fullName: 'Умид Холматов',
    email: 'umid.xolmatov@gmail.com',
    number: '+998901234511',
    organization: 'Медицинский центр "Наврўз"',
    address: 'г. Карши, ул. Ипак йўли, 3',
    status: 'active',
  },
  {
    fullName: 'Гулнора Бектемирова',
    email: 'gulnora.bektemirov@mail.ru',
    number: '+998901234512',
    organization: 'ООО "Гулшан Фарм"',
    address: 'г. Самарканд, ул. Лозиён, 9',
    status: 'active',
  },
  {
    fullName: 'Шерзод Маматов',
    email: 'sherzod.mamatov@gmail.com',
    number: '+998901234513',
    organization: 'Юридическая фирма "Лекс"',
    address: 'г. Ташкент, ул. Шота Руставели, 2',
    status: 'active',
  },
  {
    fullName: 'Барно Раззакова',
    email: 'barno.razzaqova@yandex.ru',
    number: '+998901234514',
    organization: null,
    address: 'г. Нукус, ул. Дўстлик, 17',
    status: 'active',
  },
  {
    fullName: 'Лазизбек Усмонов',
    email: 'laziz.usmonov@gmail.com',
    number: '+998901234515',
    organization: 'IT-компания "Innosoft"',
    address: 'г. Ташкент, Technopark, блок B',
    status: 'active',
  },
  {
    fullName: 'Мадина Камилова',
    email: 'madina.kamilova@outlook.com',
    number: '+998901234516',
    organization: 'Аптека "Доривор"',
    address: 'г. Коканд, ул. Истиклол, 31',
    status: 'inactive',
  },
  {
    fullName: 'Фаррух Исмоилов',
    email: 'farrukh.ismoilov@mail.ru',
    number: '+998901234517',
    organization: 'ООО "АгроТехника"',
    address: 'г. Жиззах, ул. Заrafshon, 6',
    status: 'active',
  },
  {
    fullName: 'Озода Тошматова',
    email: 'ozoda.toshmatova@gmail.com',
    number: '+998901234518',
    organization: 'Частный детский сад "Болажон"',
    address: 'г. Ташкент, Мирзо-Улугбек, 44',
    status: 'active',
  },
  {
    fullName: 'Камол Бобоев',
    email: 'kamol.boboev@yandex.ru',
    number: '+998901234519',
    organization: 'Гостиница "Сайёх"',
    address: 'г. Бухара, ул. Накшбанд, 1',
    status: 'active',
  },
  {
    fullName: 'Хилола Мансурова',
    email: 'xilola.mansurova@gmail.com',
    number: '+998901234520',
    organization: 'Республиканская клиническая больница',
    address: 'г. Ташкент, Яшнобод тумани, 18',
    status: 'active',
  },
];

async function main() {
  // ── Admin user ──────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('admin12345', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@clinic.com' },
    update: {},
    create: {
      email: 'admin@clinic.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log('✅ Admin created:', admin.email);

  // ── Clients ─────────────────────────────────────────────────
  console.log('Seeding 20 clients...');

  for (const client of clients) {
    await prisma.client.upsert({
      where: { email: client.email },
      update: {},
      create: client,
    });
  }

  console.log('Done! 20 clients seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
