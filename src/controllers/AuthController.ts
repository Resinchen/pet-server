import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { getRepository } from 'typeorm'
import logging from '../config/logging'
import User from '../models/User'

const logger = logging('Auth Controller')

class AuthController {
  async registrate(req: Request, res: Response) {
    logger.info('Register new user')
    const repository = getRepository(User)
    const { name, email, password } = req.body

    const userExists = await repository.findOne({
      where: { email },
    })

    if (userExists) {
      logger.error('Conflict: user already exist', userExists)
      return res.sendStatus(409)
    }

    const user = repository.create({ name, email, password })
    await repository.save(user)

    return res.json(user)
  }

  async authenticate(req: Request, res: Response) {
    logger.info('Authenticate user')
    const repository = getRepository(User)
    const { email, password } = req.body

    const user = await repository.findOne({ where: { email } })

    if (!user) {
      logger.error('Unauthorized: invalid email', user)
      return res.sendStatus(401)
    }

    const isValidPassword = await bcrypt.compare(password, user.password!)

    if (!isValidPassword) {
      logger.error('Unauthorized: invalid password', isValidPassword)
      return res.sendStatus(401)
    }

    const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1d' })

    delete user.password

    return res.json({ user, token })
  }
}

export default new AuthController()
