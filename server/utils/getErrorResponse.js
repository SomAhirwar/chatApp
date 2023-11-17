const {
  VALIDATION_ERROR,
  CAST_ERROR,
  JSON_WEB_TOKEN_ERROR,
  JSON_WEB_TOKEN_EXPIRED_ERROR,
  BAD_REQUEST_CODE,
  FORBIDDEN_CODE,
  DUPLICATE_FIELD_ERROR_CODE,
} = require('./constants')
const AppError = require('./appError')

const handleCastErrorDb = (err) => {
  const message = `Invalid ${err.kind}, with value: "${err.value}" provided`
  return new AppError(message, BAD_REQUEST_CODE)
}

const handelDuplicateFieldsDB = (err) => {
  // handeling duplicate field error
  const duplicateKeys = Object.keys(err.keyValue)
  const message = `Duplicate field value for fields "${duplicateKeys.join(
    ', ',
  )}". Please use another value`
  return new AppError(message, BAD_REQUEST_CODE)
}

const handleValidationErrorDb = (err) => {
  const error = Object.keys(err.errors).map((key) => err.errors[key]?.message || '')

  return new AppError(error.join(', '), BAD_REQUEST_CODE)
}

const handleJsonWebTokenError = (err) => {
  const message = 'Something went wrong. Please log in again.'
  return new AppError(message, FORBIDDEN_CODE)
}

const handleJsonWebTokenExpiredError = (err) => {
  const message = 'Token expired please login again.'
  return new AppError(message, FORBIDDEN_CODE)
}

module.exports = (err) => {
  let error = err
  if (error.name === VALIDATION_ERROR) error = handleValidationErrorDb(error)
  if (error.name === CAST_ERROR) error = handleCastErrorDb(error)
  if (error.name === JSON_WEB_TOKEN_ERROR) error = handleJsonWebTokenError(error)
  if (error.name === JSON_WEB_TOKEN_EXPIRED_ERROR) error = handleJsonWebTokenExpiredError(error)
  if (error.code === DUPLICATE_FIELD_ERROR_CODE) error = handelDuplicateFieldsDB(error)
  if (error.isOperational) {
    error = {
      status: error.status,
      type: error.type,
      message: error.message,
    }
  } else {
    console.error('error -> ', error)

    error = {
      status: 'error',
      message: 'Oops it seems there is something wrong !!!',
    }
  }

  return error
}
