import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const {
  readJSON,
  writeJSON,
  writeFile,
  readFile,
  remove,
  createReadStream,
  createWriteStream,
} = fs;

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data/authors.json"
);
const authorsAvatarsFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public/img/authors"
);
const blogPostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data/blogPosts.json"
);
export const blogPostsFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public/img/blogPosts"
);

// *************** AUTHORS ****************
export const readAuthors = () => readJSON(authorsJSONPath);
export const getAuthorsReadableStream = () => createReadStream(authorsJSONPath);
export const writeAuthors = (content) => writeJSON(authorsJSONPath, content);

// Avatars
export const saveAvatarCloudinary = new CloudinaryStorage({
  cloudinary,
  params: {
    format: "png",
    folder: "striveBlog/avatars",
  },
}); // cloudinary method

export const saveAvatar = (fileName, content) =>
  writeFile(join(authorsAvatarsFolderPath, fileName), content);
export const removeAvatar = (fileName) =>
  remove(join(authorsAvatarsFolderPath, fileName)); // fs-methods

// ************* BLOG POSTS *****************
export const readBlogPosts = () => readJSON(blogPostsJSONPath);
export const writeBlogPosts = (content) =>
  writeJSON(blogPostsJSONPath, content);

// email
export const writePDFStream = (path) => createWriteStream(path);
export const readPDFFile = (path) => readFile(path);
export const deletePDFFile = (path) => remove(path);

// Covers
export const saveCoverCloudinary = new CloudinaryStorage({
  cloudinary,
  params: {
    format: "png",
    folder: "striveBlog/covers",
  },
});

export const saveCover = (fileName, content) =>
  writeFile(join(blogPostsFolderPath, fileName), content);
export const removeCover = (fileName) =>
  remove(join(blogPostsFolderPath, fileName)); // fs method
