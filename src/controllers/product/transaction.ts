import { NextFunction, Request, Response } from 'express'

const transaction = async (req: Request, res: Response, next: NextFunction) => {
  const { address } = req.params
  res.status(200).send(address)
}

export default transaction
