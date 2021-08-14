import express from "express";
import {
  readBlogPosts,
  writeBlogPosts,
  readAuthors,
  saveCover,
  removeCover,
} from "../../lib/fs-tools.js";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { blogPostValidation, blogPostCommentValidation } from "./validation.js";
import multer from "multer";

const blogPostsRouter = express.Router(); // provide Routing

// =============== BLOG POSTS INFO =================

blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await readBlogPosts();
    console.log(blogPosts);

    if (req.query && req.query.title) {
      const filteredBlogPosts = blogPosts.filter((post) =>
        post.title
          .toLocaleLowerCase()
          .includes(req.query.title.toLocaleLowerCase())
      );
      res.send(filteredBlogPosts);
    } else {
      res.send(blogPosts);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

blogPostsRouter.get("/:_id", async (req, res, next) => {
  try {
    const paramsID = req.params._id;
    const blogPosts = await readBlogPosts();
    const blogPost = blogPosts.find((p) => p._id === paramsID);
    if (blogPost) {
      res.send(blogPost);
    } else {
      res.send(
        createHttpError(404, `Blog post with the id: ${paramsID} not found.`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.post("/", blogPostValidation, async (req, res, next) => {
  try {
    const errorList = validationResult(req);
    if (errorList.isEmpty()) {
      const authors = await readAuthors();
      const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
      const blogPosts = await readBlogPosts();
      const newBlogPost = {
        _id: uniqid(),
        createdAt: new Date(),
        readTime: { value: 1, unit: "minute" },
        author: {
          name: `${randomAuthor.name} ${randomAuthor.surname}`,
          avatar: randomAuthor.avatar,
        },
        comments: [],
        ...req.body,
      };

      blogPosts.push(newBlogPost);
      await writeBlogPosts(blogPosts);

      res.status(201).send(newBlogPost);
    } else {
      next(createHttpError(400, { errorList }));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

blogPostsRouter.put("/:_id", blogPostValidation, async (req, res, next) => {
  try {
    const errorList = validationResult(req);
    if (errorList.isEmpty()) {
      const paramsID = req.params._id;
      const blogPosts = await readBlogPosts();
      const blogPostToUpdate = blogPosts.find((p) => p._id === paramsID);

      const updatedBlogPost = { ...blogPostToUpdate, ...req.body };

      const remainingBlogPosts = blogPosts.filter((p) => p._id !== paramsID);

      remainingBlogPosts.push(updatedBlogPost);
      await writeBlogPosts(remainingBlogPosts);

      res.send(updatedBlogPost);
    } else {
      next(createHttpError(400, { errorList }));
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.delete("/:_id", async (req, res, next) => {
  try {
    const paramsID = req.params._id;
    const blogPosts = await readBlogPosts();
    const blogPost = blogPosts.find((p) => p._id === paramsID);
    if (blogPost) {
      const remainingBlogPosts = blogPosts.filter((p) => p._id !== paramsID);

      await writeBlogPosts(remainingBlogPosts);
      await removeCover(`${blogPost._id}.jpg`);

      res.send({
        message: `The Blog post with the id: ${blogPost._id} was deleted`,
        blogPost: blogPost,
      });
    } else {
      next(
        createHttpError(
          404,
          `The blog post with the id: ${paramsID} was not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

// =============== BLOG POSTS COVER =================
blogPostsRouter.post(
  "/:_id/uploadCover",
  multer().single("cover"),
  async (req, res, next) => {
    try {
      const paramsId = req.params._id;
      const blogPosts = await readBlogPosts();
      const blogPost = blogPosts.find((p) => p._id === paramsId);
      if (blogPost) {
        await saveCover(`${paramsId}.jpg`, req.file.buffer);
        const coverUrl = `http://${req.get("host")}/img/blogPosts/${
          blogPost._id
        }.jpg`;
        const remainingBlogPosts = blogPosts.filter((p) => p._id !== paramsId);
        const updatedBlogPost = { ...blogPost, cover: coverUrl };
        remainingBlogPosts.push(updatedBlogPost);
        await writeBlogPosts(remainingBlogPosts);
        res.send("Cover uploaded!");
      } else {
        next(
          createHttpError(
            404,
            `Blog post with the id: ${paramsId} was not found.`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

// =============== BLOG POSTS COMMENTS =================
blogPostsRouter.get("/:_id/comments", async (req, res, next) => {
  try {
    const paramsId = req.params._id;
    const blogPosts = await readBlogPosts();
    const blogPost = blogPosts.find((p) => p._id === paramsId);
    if (blogPost) {
      const blogPostComments = blogPost.comments;
      res.send(blogPostComments);
    } else {
      next(
        createHttpError(
          404,
          `Blog post with the id: ${paramsId} was not found.`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.post(
  "/:_id/comments",
  blogPostCommentValidation,
  async (req, res, next) => {
    try {
      const paramsId = req.params._id;
      const blogPosts = await readBlogPosts();
      const blogPost = blogPosts.find((p) => p._id === paramsId);
      if (blogPost) {
        const errorList = validationResult(req);
        if (errorList.isEmpty()) {
          //create and push new comment to blog post comments
          const newComment = { _id: uniqid(), ...req.body };
          const blogPostComments = blogPost.comments;
          blogPostComments.push(newComment);

          //rewrite the blog post with the new comment
          const remainingBlogPosts = blogPosts.filter(
            (p) => p._id !== paramsId
          );
          const updatedBlogPost = { ...blogPost, comments: blogPostComments };
          remainingBlogPosts.push(updatedBlogPost);
          await writeBlogPosts(remainingBlogPosts);
          res.send("Comment uploaded!");
        } else {
          next(createHttpError(400, { errorList }));
        }
      } else {
        next(
          createHttpError(
            404,
            `Blog post with the id: ${paramsId} was not found.`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default blogPostsRouter; // export Routing
