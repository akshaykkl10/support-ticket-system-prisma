import { ArgQuery, Query, Ticket, TicketPriority, TicketStatus } from "../types/types.js";
import { deleteTicket, insertTicket, selectTicketById, selectTickets, updateDBStatus } from "../db/pool.js";

const acceptedQueries = {
    priority:["low", "medium", "high"],
    status: ["open", "closed"]
}

const allowedSortFields = [
  "id",
  "title",
  "priority",
  "status",
  "createdat",
  "updatedat",
];

export async function listTickets(queries: Query) {
    queryValidator(queries)
    const query = queryBuilder(queries)
    const response = await selectTickets(query)
    const totalPages = queries.pagesize ? Math.ceil(response.total / queries.pagesize): 1;

    const hasNextPage = (queries.page ? queries.page : 1) < totalPages;

    const hasPreviousPage = (queries.page ? queries.page : 1) > 1;
    const buildResponse = {
        data: response.data,
        pagination: {
            page: queries.page ? queries.page : 1,
            pageSize: queries.pagesize ? queries.pagesize : "-",
            totalItems: response.total,
            totalPages,
            hasNextPage,
            hasPreviousPage
        }
    }
    return buildResponse
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
        const response = updateDBStatus(Number(id), status)
    return {
        ...response,
        status: "closed"
    }
    
}


export async function deleteFunc(id:string) {
    return deleteTicket(Number(id))
}

export async function showTicketById(id:string): Promise<Ticket> {
    const result = await selectTicketById(Number(id));
    if(result == null) throw new Error("NO_TICKET_ID")
    return result as Ticket
}

function queryValidator(queries:Query){
    if("priority" in queries) {
        if(!(acceptedQueries.priority.includes(queries.priority))) throw new Error("INVALID_PRIORITY")
    }
    // if("status" in queries) {
    //     if(!(acceptedQueries.status.includes(queries.status))) throw new Error("INVALID_STATUS")
    // }
    return true
}
function queryBuilder(queries:Query) {
    
    let query: ArgQuery = {
        where:{},
        OR:[],
        orderBy: {}
    }
    if ("id" in queries) {
        query.where = {...query.where,
            id: queries.id
        }
    }
    if ("customer_id" in queries) {
        query.where = {...query.where,
            customer_id: queries.customer_id
        }
    }
    if ("category_id" in queries) {
        query.where = {...query.where,
            category_id: queries.category_id
        }
    }
    if ("priority" in queries) {
        query.where = {...query.where,
            priority: queries.priority
        }
    }
    if ("status" in queries && queries.status) {
        let status: string[] | string | number | (string | number)[] | object = queries.status;
        if(typeof queries.status == "string" && queries.status.includes(',')){
            status = {
                in: queries.status.split(",").map(item => item.trim())
            }
        }
        query.where = {...query.where,
            status: status as TicketStatus
        }
    }
    if("page" in queries /*&& typeof queries.page == "number"*/ ) {
        query.skip = (Number(queries.page) - 1) * Number("pagesize" in queries ? queries.pagesize : 10)
    }

    if("pagesize" in queries) {
        query.pageSize = Number(queries.pagesize)
    }
    if("title" in queries) {
        query.OR?.push({
            title: {
                contains: queries.title as string,
                mode: "insensitive"
            }
        })
        queries["title"] = queries.title
    }
    if("sortField" in queries && queries.sortField) {
        if (allowedSortFields.includes(queries.sortField)) {
            const direction = queries.sortOrder === "desc" ? "desc" : "asc";
            query.orderBy = {
                [queries.sortField]: direction
            }
        }
    }
    return query as ArgQuery
}