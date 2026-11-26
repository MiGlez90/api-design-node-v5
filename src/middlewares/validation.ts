import type { Request, Response, NextFunction } from 'express'
import { type ZodType, ZodError } from 'zod'
import { APIError } from './errorHandler.ts'

export const validateBody = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body)
      req.body = validatedData
      return next()
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation not successful',
          errors: e.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        })
      }
      next(e)
    }
  }
}

export const validateParams = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params)
      return next()
    } catch (e) {
      if (e instanceof ZodError) {
        /* return res.status(400).json({
          message: 'Validation not successful',
          errors: e.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        }); */
        next(new APIError('Validation failed', 'ValidationError', 400))
      }
      next(e)
    }
  }
}

export const validateQueryParams = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query)
      return next()
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation not successful',
          errors: e.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        })
      }
      next(e)
    }
  }
}
