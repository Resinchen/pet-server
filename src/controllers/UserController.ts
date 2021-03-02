import { Request, Response } from 'express'
import userService from '../services/UserService'
import { catchable } from '../utils/decorators'
import logging from '../utils/logging'

const logger = logging('User Controller')

class UserController {
  @catchable(logger)
  async updateUser(req: Request, res: Response) {
    logger.info('Update user')
    const newUser = await userService.update(req.params.id, req.body)

    return res.json(newUser)
  }
}

export default new UserController()
