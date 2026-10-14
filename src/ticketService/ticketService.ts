import { Ticket, TicketPriority, TicketStatus } from "../types/types.js";
import { deleteTicket, insertTicket, selectTicketById, selectTickets, updateDBStatus } from "../db/pool.js";

export async function listTickets() {
    return await selectTickets()
}

export async function addTickets(customer_id:number, category_id: number, title: string, description: string, priority: TicketPriority, status: TicketStatus): Promise<Ticket> {
    const ticket: Ticket = {
        customer_id,
        category_id,
        title,
        description,
        priority,
        status
    }
    await insertTicket(ticket)
    return ticket
}

export async function updateStatus(id: string, status:TicketStatus) {
    const ticket = await selectTicketById(Number(id))
    if(selectTicketById == undefined) throw new Error("No corresponding ticket found")
    return updateDBStatus(Number(id), status)
    
}

// export async function updateAssignee(id: string, assignee:string) {
//     const tickets = await listTickets()
//     tickets.map(ticket => {
//         if(ticket.id == id){
//             ticket.assignee = assignee
//         }
//         return ticket
//     });
//     saveTicket(tickets)
//     return tickets.find(ticket => ticket.id == id)
// }

export async function deleteFunc(id:string) {
    return deleteTicket(Number(id))
}

export async function showTicketById(id:string) {
    const result = await selectTicketById(Number(id));
    if(result == null) throw new Error("NO_TICKET_ID")
    return result
}