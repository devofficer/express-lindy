import express from 'express'
import { transaction } from '../controllers/product'
const router = express.Router()

router.get('/transaction/:address', transaction)

export default router
