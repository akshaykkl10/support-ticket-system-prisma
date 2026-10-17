import { prisma } from "../src/prisma/db";
const data = [
    {id: 1, customer_id: 1, category_id: 2, title: "seed 1", description: "test desc", priority: "low", status: "open"},
    {id: 2, customer_id: 2, category_id: 1, title: "seed 2", description: "test desc", priority: "high", status: "closed"},
    {id: 3, customer_id: 3, category_id: 1, title: "seed 3", description: "test desc", priority: "medium", status: "open"},
    {id: 4, customer_id: 4, category_id: 4, title: "seed 4", description: "test desc", priority: "low", status: "closed"},
    {id: 5, customer_id: 4, category_id: 3, title: "seed 5", description: "test desc", priority: "medium", status: "closed"},
    {id: 6, customer_id: 7, category_id: 2, title: "seed 6", description: "test desc", priority: "high", status: "open"},
    {id: 7, customer_id: 10, category_id: 1, title: "seed 7", description: "test desc", priority: "low", status: "open"},
    {id: 8, customer_id: 5, category_id: 1, title: "seed 8", description: "test desc", priority: "high", status: "open"},
]

export async function resetAndSeedDb() {
    // 1. Clear existing tickets
    await prisma.ticket.deleteMany({ where: {} });

    // 2. Insert all items cleanly in one batch query
    await prisma.ticket.createMany({
        data: data,
    });
    await prisma.$executeRawUnsafe(
        `SELECT setval(pg_get_serial_sequence('ticket', 'id'), coalesce(max(id), 1)) FROM ticket;`
    );
}