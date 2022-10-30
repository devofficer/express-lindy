import { json } from 'body-parser'
import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'

dotenv.config()

const app: Express = express()
const port = process.env.PORT ? process.env.PORT : 3001

app.use(json())

app.get('/', (req: Request, res: Response) => {
  res.send('Express Typescript Server')
})

app.listen(port, () => {
  console.log(`Express TypeScript Server is running ${port}`)
})
