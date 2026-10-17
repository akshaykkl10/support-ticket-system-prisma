import express, { Request, Response } from 'express';
import ticketRouter from './router/ticketRouter.js';
import { routeHandler } from './middleware/routeHandler.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { health } from './router/healthRouter.js';
const app = express()

app.use(logger)
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({message: "Inspect your tickets."})
})

app.use("/tickets", ticketRouter)
app.use("/health", health)
app.use(routeHandler)
app.use(errorHandler)

export default app;