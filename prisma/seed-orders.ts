import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "th.kodizas@gmail.com";

  // Βρες τον χρήστη
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(`❌ Δεν βρέθηκε χρήστης με email ${email}`);
    process.exit(1);
  }

  console.log(`✅ Βρέθηκε χρήστης: ${user.id} (${email})`);

  // Δημιουργία παραγγελιών
  const ordersData = [
    {
      userId: user.id,
      items: [
        { name: "Custom Air Force 1", qty: 1, price: 150 },
        { name: "Angelus Paint Red", qty: 2, price: 7.5 },
      ],
      total: new Prisma.Decimal(165),
      currency: "EUR",
    },
    {
      userId: user.id,
      items: [
        { name: "Custom Cap", qty: 1, price: 50 },
      ],
      total: new Prisma.Decimal(50),
      currency: "EUR",
    },
  ];

  for (const data of ordersData) {
    const order = await prisma.order.create({ data });
    console.log(`🆗 Παραγγελία ${order.id} δημιουργήθηκε`);
  }

  console.log("🎉 Ολοκληρώθηκε το seed!");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
