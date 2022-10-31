import express from 'express'
import { login, logout, register } from '../controllers/auth'
import { updateLastLogout } from '../controllers/auth/passport'
const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.post('/logout', updateLastLogout, logout)

export default router
