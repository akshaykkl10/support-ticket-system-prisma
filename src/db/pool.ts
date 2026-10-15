import { Pool } from "pg";
import { DATABASE_HOST, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_USER } from "../utils/env.js";
import { ArgQuery, PaginatedTicket, Ticket, TicketStatus } from "../types/types.js";
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

export async function selectTickets(queries: ArgQuery): Promise<PaginatedTicket>{
    const { where, OR, orderBy, skip, pageSize } = queries;
    const finalWhere = {
        ...where,
        ...(OR && OR.length > 0 ? { OR } : {})
    };
    const findArgs: any = {
        where:finalWhere
    }
    if(orderBy && Object.keys(orderBy).length > 0) {
        findArgs.orderBy = orderBy
    }
    if (typeof skip === "number") {
        findArgs.skip = skip;
    }
    if (typeof pageSize === "number") {
        findArgs.take = pageSize;
    }
    const [result, total] = await prisma.$transaction([
        prisma.ticket.findMany(findArgs),
        prisma.ticket.count({
            where: finalWhere
        })
    ])
    return {data: result as Ticket[], total}
}
export async function selectTicketById(id: number){
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
export async function updateDBStatus(id: number, status: TicketStatus){
    const result = await prisma.ticket.update({
        where:{
            id: Number(id)
        }, data: {
            status: status
        }
    })
    return result
}
export async function deleteTicket(id: number){
    const result = await prisma.ticket.delete({
        where: {
            id: Number(id)
        }
    })
    return result
}




// await client.end()
