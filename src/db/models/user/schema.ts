import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Schema } from 'mongoose'
import { JwtConfig } from '../../../config'
import UserInterface from './interface'

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    lowercase: true,
    required: [true, 'Email is required'],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please use a valid address'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Please use minimum of 8 characters'],
  },
  address: {
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
UserSchema.pre<UserInterface>('save', function (next: any) {
  if (!this.isModified('password')) return next()
  const hash = bcrypt.hashSync(this.password, 10)
  this.password = hash
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
UserSchema.methods.matchPassword = function (password: string) {
  console.log(password, this.password)
  const result = bcrypt.compareSync(password, this.password)
  return bcrypt.compareSync(password, this.password)
}

/**
 * getSignedToken
 *
 * function to get signed jwt token
 *
 * @param password
 * @returns { string }
 */
UserSchema.methods.getSignedToken = function () {
  return jwt.sign(
    { email: this.email, address: this.address },
    JwtConfig.secret
  )
}

export default UserSchema
