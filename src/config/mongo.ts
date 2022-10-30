const host = process.env.MONGO_HOST ? process.env.MONGO_HOST : '127.0.0.1'
const port = process.env.MONGO_PORT ? process.env.MONGO_PORT : 27017
const database = process.env.DATABASE ? process.env.DATABASE : 'lindy'

const uri = `mongodb://${host}:${port}/${database}`

export { uri }
