import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import logging from '../config/logging'
import User from '../models/User.entity'

const logger = logging('User Controller')

class UserController {
  async updateUser(req: Request, res: Response) {
    logger.info('Update user')
    const repository = getRepository(User)

    const user = await repository.findOne(req.params.id)

    if (!user) {
      logger.error('Error: user not found')
      return res.sendStatus(404)
    }

    const newUser = await repository.merge(user, req.body)
    await repository.save(user)

    return res.json(newUser)
  }
}

export default new UserController()
