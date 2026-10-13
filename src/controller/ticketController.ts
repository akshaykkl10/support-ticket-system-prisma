import { Request, Response } from "express";
import { addTickets, deleteFunc, listTickets, showTicketById,  updateStatus } from "../ticketService/ticketService.js";
import type { Ticket, TicketPriority, TicketStatus } from "../types/types.js";

const validPriorities: TicketPriority[] = ["low", "medium", "high"];

export async function showTickets(req: Request, res: Response): Promise<void> {
    const queries = req.query
    let tickets = await listTickets()
    // if("id" in queries && queries["id"] != undefined){
    //     tickets = tickets.filter(ticket => ticket.id == queries["id"])
    // }
    // if("status" in queries && queries["status"] != undefined){
    //     tickets = tickets.filter(ticket => ticket.status == queries["status"])
    // }
    // if (tickets.length == 0){
    //     res.status(404).json({error: "Ticket not found"})
    //     return
    // }
    res.status(200).json(tickets)
}

export async function showTicket(req: Request, res: Response): Promise<void> {
    const {id} = req.params
    let ticket = await showTicketById(String(id))
    res.status(200).json(ticket)
}

export async function addTicket(req: Request, res: Response) {
    const {customer_id, category_id, title, description, priority} = req.body
    
    if( typeof title == "string" && 
        typeof description == "string" &&
        validPriorities.includes(priority as TicketPriority)
    ) {
        const ticket = await addTickets(customer_id, category_id, title, description, priority as TicketPriority, "open")
        res.status(201).json(ticket)
    }
}


export async function updateTicket(req: Request, res: Response): Promise<void> {
    const {id}  = req.params
    const body = req.body
    const idTicket = await showTicketById(id as string)
    if(!idTicket){
        res.status(404).json({error: "Ticket not found"}) 
        return
    }
    if(!("status" in body) && !("assignee" in body)) {
        res.status(404).send("No data to update")
        return
    }
    if("status" in body && body["status"] != undefined){
        const status = body["status"] as TicketStatus
        if(status == "open" || status == "closed")
            updateStatus(String(id), status)
    }

    res.status(201).json(await showTicketById(id as string))
    
}

export async function deleteTicket(req: Request, res: Response): Promise<void> {
    const {id} = req.params
    const ticket = await showTicketById(id as string)
    if(!ticket){
        res.status(404).json({error: "Ticket not found."})
    }
    deleteFunc(id as string)
    res.status(204).end()

}
