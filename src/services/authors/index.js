//================= AUTHORS CRUD =====================
import express from "express" // We need to import express to use it's functionalities
import { fileURLToPath } from "url" // it's core module to localize the current file path
import { dirname, join } from "path" // core modules, dirname will localize the directory name, join will join directory with json file name
import fs from "fs" // core module, will enable to read the json file at the particular path
import uniqueid from "uniqueid" // will generate a unique ID for the authors

const authorsRouter = express.Router() // Here we use Router express functionality to provide Routing to the server

// obtaining the path to the authors json file
//1. starting from the current file path
const currentFilePath = fileURLToPath(import.meta.url)
//2. Next we obtain the path of of the directory the current file is in
const currentDirPath = dirname(currentFilePath)
//3. Next step is to concatenate the directory path with the json file name which is authors.json
//ATTENTION USE THE METHOD JOIN (from path) AND NOT CONCATENATE AS USUAL, this way will function for every system
const authorsJSONPath = join(currentDirPath, "authors.json")

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
