import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userEmail = "th.kodizas@gmail.com"; // άλλαξε το αν θες άλλο χρήστη

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    console.error("❌ User not found:", userEmail);
    return;
  }

  console.log("✅ Found user:", user.email);

  await prisma.order.createMany({
    data: [
      {
        userId: user.id,
        items: [
          { name: "Custom AF1", price: 150, qty: 1 },
          { name: "Angelus Paint Red", price: 7.5, qty: 2 },
        ] as any,
        total: new Prisma.Decimal(165),
        currency: "EUR",
      },
      {
        userId: user.id,
        items: [
          { name: "Custom Hat", price: 50, qty: 1 },
        ] as any,
        total: new Prisma.Decimal(50),
        currency: "EUR",
      },
    ],
  });

  console.log("✅ Orders inserted successfully");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
