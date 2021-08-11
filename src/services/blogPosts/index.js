import express from "express"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs"
import uniqid from "uniqid"
import createHttpError from "http-errors"
import authorsRouter from "./services/authors"

const blogPostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogPosts.json"
) // get the path the json file

const blogPostsRouter = express.Router() // provide Routing

authorsRouter.get("/", (req, res, next) => {})
authorsRouter.get("/:id", (req, res, next) => {})
authorsRouter.post("/", (req, res, next) => {})
authorsRouter.put("/:id", (req, res, next) => {})
authorsRouter.delete("/:id", (req, res, next) => {})

export default blogPostsRouter // export Routing
