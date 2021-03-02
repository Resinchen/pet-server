import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getRepository } from 'typeorm'
import User from '../models/User.entity'
import ResponseError from '../utils/ResponseError'

class UserService {
  async registrate(
    name: string,
    email: string,
    password: string
  ): Promise<User> {
    const repo = getRepository(User)

    const userExists = await repo.findOne({ where: { email } })
    if (userExists) {
      throw new ResponseError(409, 'Conflict: user already exist')
    }

    const user = repo.create({ name, email, password })
    await repo.save(user)

    return user
  }

  async authenticate(email: string, password: string): Promise<any> {
    const repo = getRepository(User)

    const user = await repo.findOne({ where: { email } })
    if (!user) {
      throw new ResponseError(401, `Unauthorized: invalid email ${user}`)
    }

    const isValidPassword = await bcrypt.compare(password, user.password!)
    if (!isValidPassword) {
      throw new ResponseError(401, 'Unauthorized: invalid password')
    }

    const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1d' })
    delete user.password

    return { user, token }
  }

  async update(id: string, newFields: any): Promise<User> {
    const repo = getRepository(User)

    const user = await repo.findOne(id)
    if (!user) {
      throw new ResponseError(404, 'Error: user not found')
    }

    const newUser = repo.merge(user, newFields)
    await repo.save(user)

    return newUser
  }
}

export default new UserService()
