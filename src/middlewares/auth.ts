import type { Request, Response, NextFunction } from 'express'
import { verifyToken, type JwtPayload } from '../utils/jwt.ts'

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers
    const [_, token] = authorization ? authorization.split(' ') : []

    if (!token) {
      return res.status(401).json({ message: 'Not logged in' })
    }

    const payload = await verifyToken(token)
    req.user = payload
    next();
  } catch (error) {
    return res.status(503).json({ message: 'Forbidden' })
  }
}
