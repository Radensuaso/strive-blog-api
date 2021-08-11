import fs from "fs"

export const readContent = (path) => JSON.parse(fs.readFileSync(path))

export const writeContent = (path, content) =>
  fs.writeFileSync(path, JSON.stringify(content))
