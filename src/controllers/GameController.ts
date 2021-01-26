import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import logging from '../config/logging'
import Game from '../models/Game'
import User from '../models/User'

const logger = logging('Game Controller')

class GameController {
  async getAllGamesByUserId(req: Request, res: Response) {
    logger.info(`Get all game for user ${req.userId}`)

    const repository = getRepository(Game)
    const games = await repository.find({ where: { author: req.userId } })

    logger.debug(`${games[0].author}`)
    return res.json({ games })
  }

  async getGameInfoById(req: Request, res: Response) {
    logger.info('Get game by id')

    const repository = getRepository(Game)

    const game = await repository
      .createQueryBuilder('games')
      .leftJoinAndSelect('games.files', 'files')
      .where('games.id = :id', { id: req.params.id })
      .getOne()

    if (!game) {
      logger.error('Error: game not found')
      return res.sendStatus(404)
    }

    return res.json(game)
  }

  async createGame(req: Request, res: Response) {
    logger.info('Create new game')

    const repository = getRepository(Game)
    const { title } = req.body

    const gameExists = await repository.findOne({
      where: { title },
    })

    if (gameExists) {
      logger.error('Conflict: game already exist', gameExists)
      return res.sendStatus(409)
    }

    const userRepo = getRepository(User)
    const user = await userRepo.findOne(req.userId)

    const game = repository.create({ title, author: user })
    await repository.save(game)

    return res.json(game)
  }

  async updateGame(req: Request, res: Response) {
    logger.info('Update game')
    const repository = getRepository(Game)

    const game = await repository.findOne(req.params.id)

    if (!game) {
      logger.error('Error: game not found')
      return res.sendStatus(404)
    }

    const newGame = await repository.merge(game, req.body)
    await repository.save(game)

    return res.json(newGame)
  }

  async deleteGame(req: Request, res: Response) {
    logger.info('Delete game')
    const repository = getRepository(Game)

    const results = await repository.delete(req.params.id)

    return res.send(results)
  }
}

export default new GameController()
