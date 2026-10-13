import { Pool } from "pg";
import { DATABASE_HOST, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_USER } from "../utils/env.js";
import { Ticket, TicketStatus } from "../types/types.js";
import { prisma } from "../prisma/db.js";

export const client: Pool = new Pool({
    host: DATABASE_HOST,
    port:DATABASE_PORT,
    database: DATABASE_NAME,
    user: DATABASE_USER,
    password:DATABASE_PASSWORD
})

// await client.connect()
export const result = await client.query("select * from ticket;")

export async function selectTickets(){
    return await prisma.ticket.findMany()
}
export async function selectTicketById(id: string){
    return await prisma.ticket.findUnique({
        where: {
            id: Number(id)
        }
    })
}
export async function insertTicket(ticket: Ticket){
    const result = await prisma.ticket.create({
        data: {
            customer_id:ticket.customer_id,
            category_id: ticket.category_id,
            title: ticket.title,
            description: ticket.description,
            priority: ticket.priority,
            status: ticket.status
        }
    })
    return result
}
export async function updateDBStatus(id: string, status: TicketStatus){
    const result = await prisma.ticket.update({
        where:{
            id: Number(id)
        }, data: {
            status: status
        }
    })
    return result
}
export async function deleteTicket(id: string){
    const result = await prisma.ticket.delete({
        where: {
            id: Number(id)
        }
    })
    console.log(result)
    return result
}




// await client.end()
