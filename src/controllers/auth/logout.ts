import { NextFunction, Request, Response } from 'express'

/**
 * logout
 *
 * Logout user with email and password
 *
 * @param req request from frontend
 * @param res response for the request
 * @param next middleware
 */
const logout = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ status: 'success', content: 'logout' })
}

export default logout
