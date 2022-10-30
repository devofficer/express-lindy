import mongoose from 'mongoose'
import { MongoConfig } from '../config'

const connect = async () => {
  await mongoose.connect(MongoConfig.uri)
  console.log(`We are Connected at ${MongoConfig.uri}`)
}

export default connect
