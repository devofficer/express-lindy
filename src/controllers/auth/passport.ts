import { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import passportJwt from 'passport-jwt'
import { JwtConfig } from '../../config'
import { User } from '../../db/models/user'

const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JwtConfig.secret,
    },
    function (jwtToken, done) {
      User.findOne({ _id: jwtToken.id }, function (err: any, user: any) {
        if (err) return done(err, false)
        if (user) {
          return done(undefined, user, jwtToken)
        } else {
          return done(undefined, false)
        }
      })
    }
  )
)

/**
 * authenticateJwt
 *
 * Authenticate an user using jwt
 *
 * @param req request from the frontend
 * @param res response to the frontend
 * @param next middleware
 */

const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', function (err, user, info) {
    if (err) {
      console.log(err)
      return res.status(401).json({ status: 'error', code: 'unauthorized' })
    }
    if (!user) {
      return res.status(401).json({ status: 'error', code: 'unauthorized' })
    } else {
      return next()
    }
  })(req, res, next)
}

/**
 * authorizeJwt
 *
 * Authorize an user using jwt and wallet address
 *
 * @param req request from frontend
 * @param res response to the frontend
 * @param next middleware
 */
const authorizeJwt = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', function (err, user, jwtToken) {
    const { address } = req.params
    if (err) {
      return res.status(401).json({ status: 'error', code: 'unauthorized' })
    }
    if (!user) {
      return res.status(401).json({ status: 'error', code: 'unauthorized' })
    } else if (address !== user.address) {
      return res.status(401).json({ status: 'error', code: 'unauthorized' })
    } else {
      next()
    }
  })
}

export { authenticateJwt, authorizeJwt }