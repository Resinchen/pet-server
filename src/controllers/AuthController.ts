import { Request, Response } from 'express'
import userService from '../services/UserService'
import logging from '../utils/logging'

const logger = logging('Auth Controller')

class AuthController {
  async registrate(req: Request, res: Response) {
    logger.info('Register new user')
    const { name, email, password } = req.body
    const user = await userService.registrate(name, email, password)

    return res.json(user)
  }

  async authenticate(req: Request, res: Response) {
    logger.info('Authenticate user')
    const { email, password } = req.body
    const authResult = await userService.authenticate(email, password)

    return res.json(authResult)
  }
}

export default new AuthController()
