//================= AUTHORS CRUD =====================
import express from "express" // We need to import express to use it's functionalities
import { fileURLToPath } from "url" // it's core module to localize the current file path
import { dirname, join } from "path" // core modules, dirname will localize the directory name, join will join directory with json file name
import fs from "fs" // core module, will enable to read or write the json file at the particular path
import uniqid from "uniqid" // will generate a unique ID for the authors

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
  const newAuthor = { ...req.body, ID: uniqid(), createdAT: new Date() }
  //2. read the the content of authors.json
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath)) // must be parsed in every endpoint
  //3. push new author to the array
  authors.push(newAuthor)
  //4. Rewrite the new array to the json file
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authors))
  //5. send back the the ID as response
  res.status(201).send({ ID: newAuthor.ID })
})

authorsRouter.get("/", (req, res) => {
  //1. read the json file
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath))

  //2. send back an array
  res.send(authors)
})

authorsRouter.get("/:ID", (req, res) => {
  //1. get an array of authors
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
  //2. find the author with the specified ID
  const paramsID = req.params.ID // get the ID specified in tge params
  const author = authors.find((auth) => auth.ID === paramsID)
  //3. send the author back as a response
  res.send(author)
})

authorsRouter.put("/:ID", (req, res) => {
  // 1. read students.json file content
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
  //2. find specific author
  const paramsID = req.params.ID // get the ID specified in tge params
  const authorToEdit = authors.find((auth) => auth.ID === paramsID)
  //2.  edit the specific author and add it to remaing authors
  const remainingAuthors = authors.filter((auth) => auth.ID !== paramsID)
  const updatedAuthor = {
    ...req.body,
    ID: authorToEdit.ID,
    createdAT: authorToEdit.createdAT,
  }

  remainingAuthors.push(updatedAuthor)
  //3. write on the json file the updated authors
  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors))
  //4. Send back proper response
  res.send(updatedAuthor)
})

authorsRouter.delete("/:ID", (req, res) => {
  // 1. read students.json file content
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
  //2.filter out every author that isn't the id of the params
  const paramsID = req.params.ID
  const remainingAuthors = authors.filter((auth) => auth.ID !== paramsID)
  //3. write the remaining authors back to json file
  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors))
  //4.send back response
  res.status(204).send(req.method)
})

export default authorsRouter // Not to forget to export to be able to use it in the server
