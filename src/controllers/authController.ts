import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { db } from '../db/connection.ts'
import { users, type NewUser } from '../db/schema.ts'
import { comparePasswords, hashPassword } from '../utils/passwords.ts'
import { generateToken } from '../utils/jwt.ts'

export const register = async (
  req: Request<any, unknown, NewUser>,
  res: Response
) => {
  try {
    const hashedPassword = await hashPassword(req.body.password)
    const [user] = await db
      .insert(users)
      .values({
        ...req.body,
        password: hashedPassword,
      })
      .returning({
        createdAt: users.createdAt,
        email: users.email,
        firstName: users.firstName,
        id: users.id,
        lastName: users.lastName,
        username: users.username,
      })
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })
    return res.status(201).json({
      message: 'User created',
      user,
      token,
    })
  } catch (error) {
    console.error('Registration error', error)
    return res.status(500).json({ error: 'Failed to create the user' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
      })
    }

    const isValidPassword = await comparePasswords(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Invalid credentials',
      })
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })

    const { password: _rawPass, ...safeUser } = user

    return res.status(200).json({
      message: 'User created',
      token,
      user: safeUser,
    })
  } catch (error) {
    console.error('Login error', error)
    return res.status(500).json({ error: 'Failed to login' })
  }
}
