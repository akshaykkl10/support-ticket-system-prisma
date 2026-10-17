import { NextFunction, Request, Response } from "express";


export function errorHandler(err: Error, _req:Request, res: Response, next: NextFunction): void{
    if(err instanceof Error){
        console.error(err.stack)
        if(err instanceof SyntaxError ){
            res.status(400).json({error: "Invalid Json"})
            next()
        }
        if (err.message == "INVALID_JSON") {
            res.status(400).json({error: "Invalid Json"})
            next()
        }
        if(err.message == "NO_TICKET_ID") {
            res.status(404).json({error: "Ticket with given id not found"})
            next()
        }
        if(err.message == "INVALID_PAGE") {
            res.status(404).json({error: "Given page is not recommended"})
            next()
        }
        if(err.message == "DB_ERROR") {
            res.status(400).json({error: "Database encountered an error"})
            next()
        }
        res.status(400).json({error: "Unknown error"})
        next()
    }else {
        next()
    }
}