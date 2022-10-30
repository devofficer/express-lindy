import mongoose from 'mongoose'
import { MongoConfig } from '../config'

mongoose.connect(MongoConfig.uri, {
  keepAlive: true,
  socketTimeoutMS: 3000,
  connectTimeoutMS: 3000,
})

const db = mongoose.connection

db.on('open', () => {
  console.log(`We are conncted at ${MongoConfig.uri}`)
})

db.on('error', () => {
  console.log(`We can not connect to ${MongoConfig.uri}`)
})

export default db
