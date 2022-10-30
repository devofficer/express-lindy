import bcrypt from 'bcrypt'
import { Schema } from 'mongoose'

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
})

UserSchema.methods.matchPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password)
}

export default UserSchema
