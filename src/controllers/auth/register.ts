import { Request, Response } from 'express'
import { User } from '../../db/models/user'

/**
 * register
 *
 * Create user on the database
 *
 * @param req request from frontend
 * @param res response for the request
 * @param next middleware
 */
const register = async (req: Request, res: Response, next: any) => {
  const { email, password, wallet } = req.body

  try {
    const user = await User.create({
      email,
      password,
      wallet,
    })

    const token = user.getSignedToken()
    res.status(200).send({ token: token })
  } catch (e) {
    return res.status(500).send('Can not register')
  }
}

export default register
