const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const bcrypt = require('bcrypt')
const {
  SUCCESS,
  OK_CODE,
  CREATED_CODE,
  BAD_REQUEST_CODE,
  UNAUTHORIZED_CODE,
  FORBIDDEN_CODE,
  ROLE_HOST,
} = require('../utils/constants')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

const signTokenAndSendResponse = async (user, code, res) => {
  const token = signToken(user._id)

  res.status(code).json({
    status: SUCCESS,
    data: {
      user,
      token,
    },
  })
}

exports.validateUserAuthorizationHeader = async (authorizationHeader) => {
  // validating token
  let token
  if (authorizationHeader && authorizationHeader.startsWith('Bearer')) {
    const tokenArr = authorizationHeader.split(' ')
    if (tokenArr.length !== 2) {
      throw new AppError('Invalid Token, Please log in again.', UNAUTHORIZED_CODE)
    }
    token = tokenArr[1]
  }
  if (!token) throw new AppError('You are not logged in, Please log in.', UNAUTHORIZED_CODE)

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  // check if the user still exists
  const currUser = await User.findById(decode.id)

  if (!currUser)
    throw new AppError('The user belonging to this token no longer exists.', UNAUTHORIZED_CODE)

  return currUser
}

exports.protect = catchAsync(async (req, res, next) => {
  req.user = await exports.validateUserAuthorizationHeader(req.headers.authorization)
  next()
})

// checks if the user already exists
// if not create one
exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body)

  return signTokenAndSendResponse(user, CREATED_CODE, res)
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  // check if email and password actually exist
  if (!email || !password)
    return next(new AppError('Please provide email and password', BAD_REQUEST_CODE))
  // check for the password match here
  // we disabled the password show but here we have to explicitly add password
  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await bcrypt.compare(password, user.password)))
    return next(new AppError('Invalid email or password', UNAUTHORIZED_CODE))

  // if every thing ok , send token to client
  signTokenAndSendResponse(user, OK_CODE, res)
})

exports.restrictTo = (...roles) => [
  exports.protect,
  catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', FORBIDDEN_CODE))
    }
    next()
  }),
]
