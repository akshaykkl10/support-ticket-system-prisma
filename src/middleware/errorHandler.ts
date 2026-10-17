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
        if(err.message = "NO_TICKET_ID") {
            res.status(404).json({error: "Ticket with given id not found"})
        }
        res.status(400).json({error: "Unknown error"})
        next()
    }else {
        next()
    }
}