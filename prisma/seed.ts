import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import "dotenv/config"

const connectionString = process.env.DATABASE_URL;

if (!connectionString){
    throw new Error("DATABASE_URL is not configured");
}

const adapter = new PrismaPg({connectionString})

const prisma = new PrismaClient({adapter})

async function main() {
    const categories = [
        { id: 1, name: "Hardware"},
        { id: 2, name: "Software" },
        { id: 3, name: "Billing" },
        { id: 4, name: "Network" },
    ];
    for (const category of categories) {
        await prisma.category.upsert({
            where: {id: category.id},
            update: {},
            create: category,
        });
    }
    console.log("Category seed completed.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });