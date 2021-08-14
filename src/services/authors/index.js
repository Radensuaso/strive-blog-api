import express from "express";
import {
  readAuthors,
  writeAuthors,
  saveAvatar,
  removeAvatar,
} from "../../lib/fs-tools.js";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { authorsValidation } from "./validation.js";
import multer from "multer";

const authorsRouter = express.Router(); // provide Routing

// =================== AUTHORS INFO ====================

authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await readAuthors();
    console.log(authors);

    if (req.query && req.query.name) {
      const filteredAuthors = authors.filter((author) =>
        author.name
          .toLocaleLowerCase()
          .includes(req.query.name.toLocaleLowerCase())
      );
      res.send(filteredAuthors);
    } else {
      res.send(authors);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

authorsRouter.get("/:_id", async (req, res, next) => {
  try {
    const paramsId = req.params._id;
    const authors = await readAuthors();
    const author = authors.find((a) => a._id === paramsId);
    if (author) {
      res.send(author);
    } else {
      res.send(
        createHttpError(404, `Author with the id: ${paramsId} not found.`)
      );
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.post("/", authorsValidation, async (req, res, next) => {
  try {
    const errorList = validationResult(req);
    if (errorList.isEmpty()) {
      const authors = await readAuthors();
      const newAuthor = { _id: uniqid(), createdAt: new Date(), ...req.body };

      authors.push(newAuthor);
      await writeAuthors(authors);

      res.status(201).send(newAuthor);
    } else {
      next(createHttpError(400, { errorList }));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

authorsRouter.put("/:_id", authorsValidation, async (req, res, next) => {
  try {
    const paramsId = req.params._id;
    const errorList = validationResult(req);
    if (errorList.isEmpty()) {
      const authors = await readAuthors();
      const authorToUpdate = authors.find((a) => a._id === paramsId);

      const updatedAuthor = { ...authorToUpdate, ...req.body };

      const remainingAuthors = authors.filter((a) => a._id !== paramsId);

      remainingAuthors.push(updatedAuthor);
      await writeAuthors(remainingAuthors);

      res.send(updatedAuthor);
    } else {
      next(createHttpError(400, { errorList }));
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.delete("/:_id", async (req, res, next) => {
  try {
    const paramsId = req.params._id;
    const authors = await readAuthors();
    const author = authors.find((a) => a._id === paramsId);
    if (author) {
      const remainingAuthors = authors.filter((a) => a._id !== paramsId);

      await writeAuthors(remainingAuthors);
      await removeAvatar(`${author._id}.jpg`);

      res.send({
        message: `The author with the id: ${author._id} was deleted`,
        author: author,
      });
    } else {
      next(
        createHttpError(
          404,
          `The author with the id: ${paramsId} was not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

// =================== AUTHORS AVATAR ====================

authorsRouter.post(
  "/:_id/uploadAvatar",
  multer().single("avatar"),
  async (req, res, next) => {
    try {
      const paramsId = req.params._id;
      const authors = await readAuthors();
      const author = authors.find((a) => a._id === paramsId);
      if (author) {
        await saveAvatar(`${paramsId}.jpg`, req.file.buffer);
        const avatarUrl = `http://${req.get("host")}/img/authors/${
          author._id
        }.jpg`;
        const remainingAuthors = authors.filter((a) => a._id !== paramsId);
        const updatedAuthor = { ...author, avatar: avatarUrl };
        remainingAuthors.push(updatedAuthor);
        await writeAuthors(remainingAuthors);
        res.send("Avatar uploaded!");
      } else {
        next(
          createHttpError(404, `Author with the id: ${paramsId} was not found.`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default authorsRouter;
