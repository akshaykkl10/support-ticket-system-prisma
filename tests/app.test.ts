import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import app from "../src/app.js";
import type { Server } from "node:http";
import { PaginatedResponse, PaginatedTicket, Ticket } from "../src/types/types.js";
import { addTickets, deleteFunc, listTickets, showTicketById, updateStatus } from "../src/ticketService/ticketService.js";


let baseUrl: string;

let httpServer: Server;


beforeAll(async() => {
    await new Promise<void>((resolve) => {
        httpServer = app.listen(0, () => {
            const address = httpServer.address();
            if(address == null || typeof address == "string"){
                throw new Error("Could not determine the server address");
            }
            baseUrl = `http://localhost:${address.port}`;
            resolve();
        });
    });
});
afterAll(async() => {
    await new Promise<void>((resolve, reject) => {
        httpServer.close((error) => {
            if(error){
                reject(error);
                return;
            }
            resolve();
        });
    });
});

vi.mock("../src/ticketService/ticketService.js", () =>({
    addTickets: vi.fn(),
    deleteFunc: vi.fn(),
    listTickets: vi.fn(),
    showTicketById: vi.fn(),
    updateStatus: vi.fn()
}));

describe("Ticket API", ()=>{
    afterEach(() =>{
        vi.clearAllMocks()
    })
    it("Tests the loading of ticket api", async() => {
        const listMockResolve: PaginatedResponse = {
            data: [
                {
                    id:1,
                    customer_id:1,
                    category_id:1,
                    title: "Mock Title",
                    description: "Mock Description",
                    priority: "low",
                    status: "open"
                }
            ],
            pagination: {
                page: 1,
                pageSize: 8,
                totalItems: 1,
                totalPages: 1,
                hasNextPage: false,
                hasPreviousPage: false
            }
        }
        vi.mocked(listTickets).mockResolvedValue(listMockResolve)
        const response = await fetch(`${baseUrl}/tickets`)
        expect(response.headers.get('content-type')).toBe("application/json; charset=utf-8")
        expect(response.status).toBe(200)
        const body = await response.json()
        expect(typeof body).toBe("object")
        expect( body).toStrictEqual(listMockResolve)
    })
    
    it("adds tickets through post method", async() => {
        vi.mocked(addTickets).mockResolvedValue({
            customer_id:1,
            category_id:1,
            title: "whatsapp",
            description: "skip problem",
            priority: "low",
            status: "open"
        })
        const response = await fetch(`${baseUrl}/tickets`, {
            headers:{
                "content-type":"application/json"
            },
            method: "POST",
            body: JSON.stringify({
                "customer_id": "1",
                "category_id": "1",
                "title" : "whatsapp",
                "description": "skip problem",
                "priority": "low",
            })
        });
        const ticket = await response.json();
        expect(ticket).toEqual(
            expect.objectContaining({
                "title" : "whatsapp",
                "description": "skip problem",
                "priority": "low",
            })
        );
        
    });
    it("handles unknown route", async() => {
        const response = await fetch(`${baseUrl}/unknown`);
        expect(await response.json()).toStrictEqual({
            error: "Page not found"
        });
    });

    it("adds catches the invalid json input in post add tickets", async() => {
        const response = await fetch(`${baseUrl}/tickets`, {
            headers:{
                "content-type":"application/json"
            },
            method: "POST",
            body: `{
                "title" : "whatsapp",
                "description": "skip problem",
                "priority": "low",
                "assignee": "ak"
            `
        });
        expect(await response.json()).toEqual({
            error: "Invalid Json"
        });

    });

});

describe("Ticket Controllers", () => {
    
    it("updates a ticket", async() => {
        vi.mocked(showTicketById).mockResolvedValue({
            customer_id:1,
            category_id:1,
            title: "Mock Title",
            description: "Mock Description",
            priority: "low",
            status: "closed"
        })
        
        
        const updateResponse = await fetch(`${baseUrl}/tickets/${1}`,{
            headers:{
                "content-type":"application/json"
            },
            method: "PATCH",
            body: JSON.stringify({
                "status": "closed"
            })
        });
        const updatedTicketResponse = await updateResponse.json()
        expect(updatedTicketResponse).toStrictEqual(
                expect.objectContaining({
                    status: "closed",
                })
        );
    });
    
    
});