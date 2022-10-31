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
      User.findOne({ email: jwtToken.email }, function (err: any, user: any) {
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
  passport.authenticate('jwt', function (err, user, jwtToken) {
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
    const lastLogout = user.lastLogout
    if (err) {
      console.log(err)
      return res.status(401).json({ status: 'error', code: 'unauthorized' })
    }
    if (!user) {
      return res.status(500).json({ status: 'error', code: 'unauthorized' })
    } else if (address !== user.address || lastLogout !== jwtToken.lastLogout) {
      return res.status(401).json({ status: 'error', code: 'unauthorized' })
    } else {
      next()
    }
  })(req, res, next)
}

const updateLastLogout = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', function (err, user, jwtToken) {
    if (err) {
      console.log(err)
      return res.status(401).json({ status: 'error', code: 'unauthorized' })
    }
    if (!user) {
      return res.status(500).json({ status: 'error', code: 'unauthorized' })
    } else {
      user.lastLogout = Date.now()
      user.save(function () {
        next()
      })
    }
  })(req, res, next)
}

export { authenticateJwt, authorizeJwt, updateLastLogout }
