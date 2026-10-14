export type TicketStatus = "open" | "closed"
export type TicketPriority = "low" | "medium" | "high"
export interface Ticket {
    id?: number
    customer_id: number
    category_id: number
    title: string
    description: string | null
    priority: TicketPriority
    status: TicketStatus
    createdat?: Date
    updateat?: Date
}