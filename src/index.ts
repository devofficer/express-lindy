import { json } from 'body-parser'
import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'
import { ServerConfig } from './config'
import connect from './db'

dotenv.config()

// connect mongo db server
connect()

const app: Express = express()

app.use(json())

app.get('/', (req: Request, res: Response) => {
  res.send('Express Typescript Server')
})

app.listen(ServerConfig.port, () => {
  console.log(`Express TypeScript Server is running ${ServerConfig.port}`)
})
