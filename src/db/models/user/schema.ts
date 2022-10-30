import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { Schema } from 'mongoose'
import { JwtConfig } from '../../../config'
import UserInterface from './interface'

const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    required: [true, 'Email is required'],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please use a valid address'],
    unique: true,
  },
  password: {
    type: String,
    lowercase: true,
    required: [true, 'Password is required'],
    minlength: [8, 'Please use minimum of 8 characters'],
  },
  walletAddress: {
    type: String,
    lowercase: true,
    required: [true, 'Wallet Address is required'],
  },
  resetPasswordToken: String,
  resetPasswordExpire: String,
})

/**
 * Password Middleware
 *
 * Save the hash vale of user input password
 *
 */
UserSchema.pre<UserInterface>('save', async function (next: any) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = bcrypt.hashSync(this.password, salt)
  next()
})

/**
 * matchPassword
 *
 * function to check current password is equal to password from db
 *
 * @param password
 * @returns { boolean }
 */
UserSchema.methods.matchPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password)
}

/**
 * getSignedToken
 *
 * function to get signed jwt token
 *
 * @param password
 * @returns { string }
 */
UserSchema.methods.getSignedToken = function (password: string) {
  return jwt.sign({ id: this._id }, JwtConfig.secret, {
    expiresIn: JwtConfig.expire,
  })
}

/**
 *
 * getResetPasswordToken
 *
 * function to get reset password token when the time is expired
 *
 * @returns
 */
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex')
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000)
  return resetToken
}

export default UserSchema
