import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { deleteTicket, insertTicket, selectTicketById, selectTickets, updateDBStatus } from "../src/db/pool.js"
import type { ArgQuery, PaginatedTicket, Ticket } from "../src/types/types.js";
import { prisma } from "../src/prisma/db.js";

let testticket: Ticket;
beforeAll( async () => {
    await prisma.ticket.deleteMany();
       
})

beforeEach(async() => {
    await prisma.ticket.deleteMany();
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
afterAll( async () => {
    await prisma.ticket.deleteMany()
})
describe("Prisma Functions in Pool Module", async () => {
    console.log(testticket, "this is ticket")
    let query: ArgQuery = {
        where:{},
        OR:[],
        orderBy: {}
    }
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
    })

    it("selects ticket by id", async() => {
        const resultID = await selectTicketById(testticket.id as number)
        expect(resultID).toStrictEqual(testticket)
    })
    // it("updates a ticket status", async () => {
    //     const updateResult = await updateDBStatus(ticket.id as number, "closed");
    //     expect(updateResult.status).toEqual("closed")
    // })
    it("deletes a ticket by id", async () => {
        const result = await deleteTicket(testticket.id as number)
        expect(result).toMatchObject({
            ...testticket
        })
    })
})