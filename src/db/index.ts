import mongoose from 'mongoose'
import { MongoConfig } from '../config'

const connect = async () => {
  await mongoose.connect(MongoConfig.uri)
}

const db = mongoose.connection

db.on('open', () => {
  console.log(`We are conncted at ${MongoConfig.uri}`)
})

db.on('error', () => {
  console.log(`We can not connect to ${MongoConfig.uri}`)
})

export default connect
