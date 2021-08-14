import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile, remove } = fs;

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
const blogPostsFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public/img/blogPosts"
);

// *************** AUTHORS ****************
export const readAuthors = () => readJSON(authorsJSONPath);
export const writeAuthors = (content) => writeJSON(authorsJSONPath, content);

// Avatars
export const saveAvatar = (fileName, content) =>
  writeFile(join(authorsAvatarsFolderPath, fileName), content);
export const removeAvatar = (fileName) =>
  remove(join(authorsAvatarsFolderPath, fileName));

// ************* BLOG POSTS *****************
export const readBlogPosts = () => readJSON(blogPostsJSONPath);
export const writeBlogPosts = (content) =>
  writeJSON(blogPostsJSONPath, content);

// Covers
export const saveCover = (fileName, content) =>
  writeFile(join(blogPostsFolderPath, fileName), content);
export const removeCover = (fileName) =>
  remove(join(blogPostsFolderPath, fileName));
