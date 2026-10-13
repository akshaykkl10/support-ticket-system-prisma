import app from "./app.js"
import { client } from "./db/pool.js";
import { PORT } from "./utils/env.js";


const server = app.listen(PORT, ()=> {
    console.log(`Server running at http://localhost:${PORT}`);
})

let shut = false

function shutdown(signal: string){
    if(shut)return;
    shut = true

    console.log(` Recived ${signal}`)
    server.close((serverError: Error | undefined) => {
        if (serverError) {
            console.log(`Encountered : ${serverError}`)
        }
        void client.end().then(() => {
            console.log("PostgreSQL connection pool closed.");
    
        }).catch((error: unknown) =>{
            console.log(`Encountered : ${error}`)
        });
    });
}

process.on("SIGINT", () => {
    shutdown("SIGINT")
})