import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config/config'
import logging from '../config/logging'

const logger = logging('Auth middleware')

interface TokenPayload {
  id: string
  iat: number
  exp: number
}

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers

  if (!authorization) {
    logger.error('Unauthorized: invalid headers')
    return res.sendStatus(401)
  }

  const token = authorization.replace('Bearer', '').trim()

  try {
    const data = jwt.verify(token, config.auth.jwt_secret_key)
    const { id } = data as TokenPayload

    req.userId = id

    return next()
  } catch (err) {
    logger.error('Unauthorized: invalid token', err)
    return res.sendStatus(401)
  }
}
