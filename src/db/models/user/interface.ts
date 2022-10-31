import { Document } from 'mongoose'

interface IUser extends Document {
  email: string
  password: string
  address: string
  lastLogout: Date
  matchPassword(password: string): boolean | PromiseLike<boolean>
  getSignedToken(): string
}

export default IUser
