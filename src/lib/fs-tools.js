import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON, writeFile } = fs

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data/authors.json"
)

const blogPostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data/blogPosts.json"
)

// *************** AUTHORS ****************
export const readAuthors = () => readJSON(authorsJSONPath)
export const writeAuthors = (content) => writeJSON(authorsJSONPath, content)

// ************* BLOG POSTS *****************
export const readBlogPosts = () => readJSON(blogPostsJSONPath)
export const writeBlogPosts = (content) => writeJSON(blogPostsJSONPath, content)
