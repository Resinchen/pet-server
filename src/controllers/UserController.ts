import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import logging from '../config/logging'
import User from '../models/User'

const logger = logging('User Controller')

class UserController {
  async index(req: Request, res: Response) {
    return res.json({ userID: req.userId })
  }

  async store(req: Request, res: Response) {
    logger.info('Create new User')
    const repository = getRepository(User)
    const { email, password } = req.body

    const userExists = await repository.findOne({ where: { email } })

    if (userExists) {
      logger.error('Conflict: user already exist', userExists)
      return res.sendStatus(409)
    }

    const user = repository.create({ email, password })

    await repository.save(user)

    return res.json(user)
  }
}

export default new UserController()
