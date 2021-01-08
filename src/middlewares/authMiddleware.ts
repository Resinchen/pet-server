import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
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

  //TODO: extract secret key to config
  try {
    const data = jwt.verify(token, 'secret')
    const { id } = data as TokenPayload

    req.userId = id

    return next()
  } catch (err) {
    logger.error('Unauthorized: invalid token', err)
    return res.sendStatus(401)
  }
}
