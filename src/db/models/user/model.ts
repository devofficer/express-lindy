import { Model } from 'mongoose'
import UserInterface from './interface'
import UserSchema from './schema'

const User: Model<UserInterface> = new Model('User', UserSchema)

export default User
