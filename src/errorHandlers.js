export const notFoundHandler = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send(err.message)
  } else {
    next(err)
  }
}

export const badRequestHandler = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send(err.errorList)
  } else {
    next(err)
  }
}

export const forbiddenHandler = (err, req, res, next) => {
  if (err.status === 403) {
    res.status(403).send(err.errorList)
  } else {
    next(err)
  }
}

export const genericServerErrorHandler = (err, req, res, next) => {
  res.status(500).send("Generic server Error, contact support.")
}
