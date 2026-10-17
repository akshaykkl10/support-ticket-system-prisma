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
    const customers = [
        {id: 1, name: "Akshay", email: "akshay@vonnue.com"},
        {id: 2, name: "Sharath", email: "sharath@plkn.in"},
        {id: 3, name: "Jithesh", email: "jithesh@shms.com"},
        {id: 4, name: "Abhiram", email: "abhiram@vlr.in"},
        {id: 5, name: "Abhineeth", email: "abhineeth@ssc.gov.in"},
        {id: 6, name: "Sagar", email: "sagar@msc.org"},
        {id: 7, name: "Sutheerth", email: "sutheerth@ssc.gov.in"},
        {id: 8, name: "Sandeep", email: "sandeep@kpa.gov.in"},
        {id: 9, name: "Sreeraj", email: "sreeraj@rvn.gov.in"},
        {id: 10, name: "Aiswarya", email: "aiswarya@relaxplzz.com"}
    ]
    for (const customer of customers) {
        await prisma.customers.upsert({
            where: {id: customer.id},
            update: {},
            create: customer
        });
    }
    console.log("Customer seed completed.");
    const tickets = [
        {id: 1, customer_id: 1, category_id: 2, title: "seed 1", description: "test desc", priority: "low", status: "open"},
        {id: 2, customer_id: 2, category_id: 1, title: "seed 2", description: "test desc", priority: "high", status: "closed"},
        {id: 3, customer_id: 3, category_id: 1, title: "seed 3", description: "test desc", priority: "medium", status: "open"},
        {id: 4, customer_id: 4, category_id: 4, title: "seed 4", description: "test desc", priority: "low", status: "closed"},
        {id: 5, customer_id: 4, category_id: 3, title: "seed 5", description: "test desc", priority: "medium", status: "closed"},
        {id: 6, customer_id: 7, category_id: 2, title: "seed 6", description: "test desc", priority: "high", status: "open"},
        {id: 7, customer_id: 10, category_id: 1, title: "seed 7", description: "test desc", priority: "low", status: "open"},
        {id: 8, customer_id: 5, category_id: 1, title: "seed 8", description: "test desc", priority: "high", status: "open"},
    ]
    await prisma.ticket.deleteMany({where:{}})
    for (const ticket of tickets) {
        await prisma.ticket.upsert({
            where:{id: ticket.id},
            update:{},
            create:ticket
        })
    }
    console.log("Ticket seed completed.");

}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });