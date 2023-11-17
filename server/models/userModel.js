const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const { MIN_PASSWORD_LENGTH, ROLE_HOST, ROLE_USER } = require('../utils/constants')

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Email is invalid'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: [(value) => value.length === 10, 'Phone number is not in correct format'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a Password'],
    minlength: [
      MIN_PASSWORD_LENGTH,
      `Password must have at least ${MIN_PASSWORD_LENGTH} character`,
    ],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your Password'],
    validate: {
      validator(el) {
        return el === this.password
      },
      message: 'Password not match with confirm password',
    },
  },
  role: {
    type: String,
    enum: [ROLE_USER, ROLE_HOST],
    default: ROLE_USER,
  },
})

userSchema.pre('save', async function (next) {
  // this function works only when the password is modified
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
  return next()
})

userSchema.methods.correctPassword = async (candidatePassword, userPassword) => {
  // compaired the password at time of login
  const compareResult = await bcrypt.compare(candidatePassword, userPassword)
  return compareResult
}

const User = mongoose.model('User', userSchema)

module.exports = User
