import express from "express" // import express from express
import cors from "cors" // will enable the frontend to communicate with the backend
import listEndpoints from "express-list-endpoints" // will show us the detailed endpoints
import authorsRouter from "./services/authors/index.js"

const server = express() //our server function initialized with express()
const port = 3001 // this will be the port on with the server will run

server.use(cors())
server.use(express.json()) // this will enable reading of the requests bodies

// ========== ROUTES =============

server.use("/authors", authorsRouter) // this will provide the endpoints of authors with a common name to POST, GET, PUT and DELETE

console.table(listEndpoints(server)) // will show us the detailed endpoints in a table

server.listen(port, () =>
  console.log(`Server is listening to the port ${port}.`)
)
