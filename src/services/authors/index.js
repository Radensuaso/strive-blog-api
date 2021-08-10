//================= AUTHORS CRUD =====================
import express from "express" // We need to import express to use it's functionalities

const authorsRouter = express.Router() // Here we use Router express functionality to provide Routing to the server

authorsRouter.post("/", (req, res) => {
  res.status(201).send(req.body)
})

export default authorsRouter // Not to forget to export to be able to use it in the server
