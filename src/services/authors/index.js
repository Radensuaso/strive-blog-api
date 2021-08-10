//================= AUTHORS CRUD =====================
import express from "express" // We need to import express to use it's functionalities

const authorsRouter = express.Router() // Here we use Router express functionality to provide Routing to the server

authorsRouter.post("/", (req, res) => {
  res.status(201).send(req.method)
})

authorsRouter.get("/", (req, res) => {
  res.send(req.method)
})

authorsRouter.get("/:_id", (req, res) => {
  res.send(req.method + " single")
})

authorsRouter.put("/:_id", (req, res) => {
  res.send(req.method)
})

authorsRouter.delete("/:_id", (req, res) => {
  res.status(204).send(req.method)
})

export default authorsRouter // Not to forget to export to be able to use it in the server
