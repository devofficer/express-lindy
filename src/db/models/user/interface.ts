import { Document } from 'mongoose'

interface UserInterface extends Document {
  email: string
  password: string
  walletAddress: string
  matchPassword(password: string): boolean | PromiseLike<boolean>
}

export default UserInterface
