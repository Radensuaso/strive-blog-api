import express from "express"
import { readBlogPosts, writeBlogPosts } from "../../lib/fs-tools.js"
import uniqid from "uniqid"
import createHttpError from "http-errors"
import { validationResult } from "express-validator"
import { blogPostValidation } from "./validation.js"

const blogPostsRouter = express.Router() // provide Routing

blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const posts = await readBlogPosts()
    console.log(posts)

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
    console.log(error)
    next(error)
  }
})

blogPostsRouter.get("/:_id", async (req, res, next) => {
  try {
    const posts = await readBlogPosts()
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

blogPostsRouter.post("/", blogPostValidation, async (req, res, next) => {
  try {
    const errorList = validationResult(req)
    if (errorList.isEmpty()) {
      const posts = await readBlogPosts()
      const newPost = { _id: uniqid(), createdAt: new Date(), ...req.body }

      posts.push(newPost)
      await writeBlogPosts(posts)

      res.status(201).send(newPost)
    } else {
      next(createHttpError(400, { errorList }))
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

blogPostsRouter.put("/:_id", blogPostValidation, async (req, res, next) => {
  try {
    const errorList = validationResult(req)
    if (errorList.isEmpty()) {
      const posts = await readBlogPosts()
      const postToUpdate = posts.find((p) => p._id === req.params._id)

      const updatedPost = { ...postToUpdate, ...req.body }

      const remainingPosts = posts.filter((p) => p._id !== req.params._id)

      remainingPosts.push(updatedPost)
      await writeBlogPosts(remainingPosts)

      res.send(updatedPost)
    } else {
      next(createHttpError(400, { errorList }))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.delete("/:_id", async (req, res, next) => {
  try {
    const posts = await readBlogPosts()
    const post = posts.find((p) => p._id === req.params._id)
    if (post) {
      const remainingPosts = posts.filter((p) => p._id !== req.params._id)

      await writeBlogPosts(remainingPosts)

      res.send({
        message: `The Post with the id: ${post._id} was deleted`,
        post: post,
      })
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
