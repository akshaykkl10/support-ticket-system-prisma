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

export interface PaginatedTicket  {
    data: Ticket[]
    total: number
}

export interface PaginatedResponse  {
    data: Ticket[]
    pagination: {
        page: number
        pageSize: number | string
        totalItems: number
        totalPages: number
        hasNextPage: boolean
        hasPreviousPage: boolean
    } 
}

export interface Query {
  id?: number;
  customer_id?: number;
  category_id?: number;
  priority?: TicketPriority;
  status?: TicketStatus;
  page?: number;
  pagesize?: number;
  title?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc"; // Added to handle dynamic directions
}
export interface ArgQuery {
    where?: {
    id?: number;
    customer_id?: number;
    category_id?: number;
    status?: TicketStatus;
    priority?: TicketPriority;
  };
    OR?: Array<{
        title?: {
        contains: string;
        mode: "insensitive";
        };
    }>;
    orderBy?: Record<string, "asc" | "desc">;
    skip?: number
    pageSize?: number
}