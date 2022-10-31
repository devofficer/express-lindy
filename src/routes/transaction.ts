import express from 'express'
import { authenticateJWT } from '../controllers/auth/passport'
import { transaction } from '../controllers/product'
const router = express.Router()

router.get('/transaction/:address', authenticateJWT, transaction)

export default router
