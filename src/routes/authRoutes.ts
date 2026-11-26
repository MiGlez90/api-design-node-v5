import { Router } from 'express'
import { login, register } from '../controllers/authController.ts'
import { validateBody } from '../middlewares/validation.ts'
import { loginUserSchema, insertUserSchema } from '../db/schema.ts'

const router = Router()

router.post('/register', validateBody(insertUserSchema), register)

router.post('/login', validateBody(loginUserSchema), login)

export default router
