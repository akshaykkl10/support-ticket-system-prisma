import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { deleteTicket, insertTicket, selectTicketById, selectTickets, updateDBStatus } from "../src/db/pool.js"
import type { ArgQuery, Ticket } from "../src/types/types.js";
import { prisma } from "../src/prisma/db.js";
import { resetAndSeedDb } from "./dbreset.js";


it("connects to the test dataset", async () => {
    const result = await prisma.$queryRaw<
    {current_database: string}[]
    >`SELECT current_database()`;
    
    console.log("Connected database:", result[0].current_database);

    expect(result[0].current_database).toBe("support_ticket_test_db");
});



let testticket: Ticket;

beforeEach(async() => {

    await resetAndSeedDb()
    
    testticket = await prisma.ticket.create({
        data:{
            customer_id:1,
            category_id: 1,
            title: "test title",
            description: "test desc",
            priority: "low",
            status: "open"
        }
    }) as Ticket;
})
afterEach(async() => {
    await resetAndSeedDb()
})


describe("Prisma Functions in Pool Module", async () => {
    let query: ArgQuery = {
        where:{},
        OR:[],
        orderBy: {}
    };
    it("selects tickets from the database", async () => {
        const result = await selectTickets(query)
        expect(result).toEqual(
            expect.any(Object)
        )
    })

    it("inserts a ticket", async() => {
        const ticket:Ticket = {
            customer_id:1,
            category_id:1,
            title: "Bonjour",
            description: "French Chamber",
            priority: "low", 
            status: "open"
        }
        const result = await insertTicket(ticket)
        expect(result).toMatchObject(ticket)
    });

    it("selects ticket by id", async() => {
        const resultID = await selectTicketById(testticket.id as number)
        expect(resultID).toStrictEqual(testticket)
    })
    it("updates a ticket status", async () => {
        const updateResult = await updateDBStatus(testticket.id as number, "closed");
        expect(updateResult.status).toEqual("closed")
    })
    it("deletes a ticket by id", async () => {
        const result = await deleteTicket(testticket.id as number)
        expect(result).toMatchObject({
            ...testticket
        })
    })
})