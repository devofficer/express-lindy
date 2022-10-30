import { model, Model } from 'mongoose'
import IUser from './interface'
import UserSchema from './schema'

const User: Model<IUser> = model<IUser>('User', UserSchema)

export default User
