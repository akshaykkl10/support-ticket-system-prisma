import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import app from "../src/app.js";
import request from "supertest";
import { resetAndSeedDb } from "./dbreset.js";
import * as poolModule from "../src/db/pool.js";


beforeEach(async () => {
    await resetAndSeedDb();
});

afterEach(async () => {
    await resetAndSeedDb();
});



describe("http testing", () => {
    it("response from GET / from app", async() => {
        const response = await request(app).get("/")
        expect(response.status).toEqual(200)
        expect(response.body).toEqual({message: "Inspect your tickets."})
    })
    it("response from GET /health from app", async() => {
        const response = await request(app).get("/health")
        expect(response.status).toEqual(200)
        expect(response.body).toEqual({health: "good"})
    })
    it("response from GET /tickets from app", async() => {
        const response = await request(app).get("/tickets")
        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject({
            pagination: {
                page: 1,
                pageSize: 8,
                totalItems: 8,
                totalPages: 1,
                hasNextPage: false,
                hasPreviousPage: false
            }
        })
    })
     it("response from GET /tickets from app", async() => {
        const response = await request(app).get("/tickets")
        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject({
            pagination: {
                page: 1,
                pageSize: 8,
                totalItems: 8,
                totalPages: 1,
                hasNextPage: false,
                hasPreviousPage: false
            }
        })
    })
    it("takes pagination parameters through GET", async() => {
        const response = await request(app).get("/tickets?page=2&pagesize=3")
        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject({
            pagination: {
                page:2,
                pageSize:3,
                totalItems: 8,
                totalPages: 3,
                hasNextPage: true,
                hasPreviousPage: true
            }
        })
    })
    it("Filters ticket by open status", async() => {
        const response = await request(app).get("/tickets?status=open")
        expect(response.status).toEqual(200)
        response.body.data.forEach((ticket: any) => {
            expect(ticket.status).toEqual("open")
        });
    })
    it("Filters ticket by closed status", async() => {
        const response = await request(app).get("/tickets?status=closed")
        expect(response.status).toEqual(200)
        response.body.data.forEach((ticket: any) => {
            expect(ticket.status).toEqual("closed")
        });
    })
    it("Searches ticket by title field", async() => {
        const response = await request(app).get("/tickets?title=seed+1")
        expect(response.status).toEqual(200)
        expect(response.body.data.length).toEqual(1)
        expect(response.body.data[0].title).toEqual("seed 1")
    })
    it("POST to app /tickets ", async () => {
        const response = await request(app).post("/tickets").send({
            "customer_id": 1,
            "category_id": 3,
            "title" : "api test post",
            "description": "test desc",
            "priority": "low"
        });
        expect(response.status).toBe(201)
        expect(response.body).toMatchObject({
            "customer_id": 1,
            "category_id": 3,
            "title" : "api test post",
            "description": "test desc",
            "status": "open",
            "priority": "low"
        })
    });
    it("POST invalid ticket to app /tickets ", async () => {
      const response = await request(app).post("/tickets").send(JSON.parse(`{
            "category_id": 3,
            "title" : "api test post",
            "description": "test desc",
            "priority": "low"
        }`));
        expect(response.status).toBe(400)
        expect(response.body).toStrictEqual({error: "Invalid Json"})
    });
    it("tries to get a non existent ticket", async() => {
        const response = await request(app).get("/tickets/100");
        expect(response.status).toEqual(404);
        expect(response.body).toStrictEqual({
            error: "Ticket with given id not found"
        })
    });
    it("tries to get a non existent ticket", async() => {
        const response = await request(app).get("/tickets?page=2");
        expect(response.status).toEqual(404);
        expect(response.body).toStrictEqual({
            error: "Given page is not recommended"
        })
    })
    it(" reacts on a db error", async() => {
        vi.spyOn(poolModule, "selectTickets").mockRejectedValue(new Error("DB_ERROR"))
        const response = await request(app).get("/tickets")
        expect(response.status).toEqual(400)
        expect(response.body).toMatchObject({
            error: "Database encountered an error"
        })
        vi.clearAllMocks()
    })
})