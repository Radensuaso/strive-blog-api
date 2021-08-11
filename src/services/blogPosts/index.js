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

    if (req.query && req.query.title) {
      const filteredPosts = posts.filter((post) =>
        post.title
          .toLocaleLowerCase()
          .includes(req.query.title.toLocaleLowerCase())
      )
      res.send(filteredPosts)
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
        createHttpError(404, `Post with the id: ${req.params._id} not found.`)
      )
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.post("/", blogPostValidation, (req, res, next) => {
  try {
    const errorList = validationResult(req)
    if (errorList.isEmpty()) {
      const posts = readContent(blogPostsJSONPath)
      const newPost = { _id: uniqid(), createdAt: new Date(), ...req.body }

      posts.push(newPost)
      writeContent(blogPostsJSONPath, posts)

      res.status(201).send(newPost)
    } else {
      next(createHttpError(400, { errorList }))
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

blogPostsRouter.put("/:_id", blogPostValidation, (req, res, next) => {
  try {
    const errorList = validationResult(req)
    if (errorList.isEmpty()) {
      const posts = readContent(blogPostsJSONPath)
      const postToUpdate = posts.find((p) => p._id === req.params._id)

      const updatedPost = { ...postToUpdate, ...req.body }

      const remainingPosts = posts.filter((p) => p._id !== req.params._id)

      remainingPosts.push(updatedPost)
      writeContent(blogPostsJSONPath, remainingPosts)

      res.send(updatedPost)
    } else {
      next(createHttpError(400, { errorList }))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.delete("/:_id", (req, res, next) => {
  try {
    const posts = readContent(blogPostsJSONPath)
    const post = posts.find((p) => p._id === req.params._id)
    if (post) {
      const remainingPosts = posts.filter((p) => p._id !== req.params._id)

      writeContent(blogPostsJSONPath, remainingPosts)

      res.send(post)
    } else {
      next(
        createHttpError(
          404,
          `Post with the id: ${req.params._id} was not found`
        )
      )
    }
  } catch (error) {
    next(error)
  }
})

export default blogPostsRouter // export Routing
