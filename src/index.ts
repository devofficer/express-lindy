import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'
import { ServerConfig } from './config'
import db from './db'
import { auth } from './routes'

db.on('connected', () => {
  console.log(db.host)
})

dotenv.config()

const app: Express = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api/auth', auth)

app.get('/', (req: Request, res: Response) => {
  res.send('Express Typescript Server')
})

app.listen(ServerConfig.port, () => {
  console.log(`Express TypeScript Server is running ${ServerConfig.port}`)
})
