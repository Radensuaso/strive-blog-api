//================= AUTHORS CRUD =====================
import express from "express" // We need to import express to use it's functionalities
import { fileURLToPath } from "url" // it's core module to localize the current file path
import { dirname, join } from "path" // core modules, dirname will localize the directory name, join will join directory with json file name
import fs from "fs" // core module, will enable to read or write the json file at the particular path
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
  console.log(req.body) // remember to add server.use(express.json()) to the server file
  //1. read the requests body
  const newAuthor = { ...req.body, ID: uniqueid, createdAT: new Date() }
  //2. read the the content of authors.json
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
  //3. push new author to the array
  authors.push(newAuthor)
  //4. Rewrite the new array to the json file
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authors))
  //5. send back the the ID as response
  res.status(201).send({ ID: newAuthor.ID })
})

authorsRouter.get("/", (req, res) => {
  res.send(req.method)
})

authorsRouter.get("/:ID", (req, res) => {
  res.send(req.method + " single")
})

authorsRouter.put("/:ID", (req, res) => {
  res.send(req.method)
})

authorsRouter.delete("/:ID", (req, res) => {
  res.status(204).send(req.method)
})

export default authorsRouter // Not to forget to export to be able to use it in the server
