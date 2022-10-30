import { Request, Response } from 'express'
import { IUser, User } from '../../db/models/user'

/**
 * login
 *
 * Login user with email and password
 *
 * @param req request from frontend
 * @param res response for the request
 * @param next middleware
 */
const login = async (req: Request, res: Response, next: any) => {
  const { email, password } = req.body
  if (!email || !password)
    return next(res.status(401).send('Invalid Credentails'))

  try {
    const user: IUser | null = await User.findOne({ email: email })
    if (!user) return res.status(401).send('Invalid Email')
    const isMatch = await user.matchPassword(password)
    if (!isMatch) return res.status(401).send('Invalid Password')
    const token = user.getSignedToken()
    res.status(200).send({ token: token })
  } catch (e) {
    res.status(500).send('Can not Login')
  }
}

export default login
