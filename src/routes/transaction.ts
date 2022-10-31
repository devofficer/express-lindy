import express from 'express'
import { authorizeJwt } from '../controllers/auth/passport'
import { transaction } from '../controllers/product'
const router = express.Router()

router.get('/transaction/:address', authorizeJwt, transaction)

export default router
