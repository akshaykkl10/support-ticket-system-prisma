import { describe, expect, it } from "vitest";
import { deleteTicket, insertTicket, selectTicketById, selectTickets, updateDBStatus } from "../src/db/pool.js"
import type { Ticket } from "../src/types/types.js";
describe("Prisma Functions in Pool Module", async () => {
    const result = await selectTickets()
    const ticket = result[0]
    it("selects tickets from the database", async () => {
        const result = await selectTickets()
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
        const resultID = await selectTicketById(ticket.id as number)
        expect(resultID).toStrictEqual(ticket)
    })
    it("updates a ticket status", async () => {
        const updateResult = await updateDBStatus(ticket.id as number, "closed");
        expect(updateResult.status).toEqual("closed")
    })
    it("deletes a ticket by id", async () => {
        const result = await deleteTicket(ticket.id as number)
        expect(result).toMatchObject({
            ...ticket,
            status: "closed"
        })
    })
})