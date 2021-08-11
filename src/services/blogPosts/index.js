import express from "express"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"
import createHttpError from "http-errors"
import { readContent, writeContent } from "../../functions/readAndWrite.js"
import { validationResult } from "express-validator"
import { blogPostValidation } from "./validation.js"

const blogPostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogPosts.json"
) // get the path the json file

const blogPostsRouter = express.Router() // provide Routing

blogPostsRouter.get("/", (req, res, next) => {
  try {
    const posts = readContent(blogPostsJSONPath)

    if (req.query && req.query.category) {
      const categoryPosts = posts.filter((post) =>
        post.category.includes(req.query.category)
      )
      res.send(categoryPosts)
    } else {
      res.send(posts)
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.get("/:_id", (req, res, next) => {
  try {
    const posts = readContent(blogPostsJSONPath)
    const post = posts.find((p) => p._id === req.params._id)
    if (post) {
      res.send(post)
    } else {
      res.send(
        createHttpError(404, `Post with the id:${req.params._id} not found.`)
      )
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.post("/", blogPostValidation, (req, res, next) => {
  try {
    const errorsList = validationResult(req)
    if (errorsList.isEmpty()) {
      const posts = readContent(blogPostsJSONPath)
      const newPost = { ...req.body, _id: uniqid(), createdAt: new Date() }

      posts.push(newPost)
      writeContent(blogPostsJSONPath, posts)

      res.status(201).send(newPost)
    } else {
      next(createHttpError(400, { errorsList }))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.put("/:_id", (req, res, next) => {
  try {
    res.send("here it is")
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.delete("/:_id", (req, res, next) => {
  try {
    res.status(204).send("here it is")
  } catch (error) {
    next(error)
  }
})

export default blogPostsRouter // export Routing
