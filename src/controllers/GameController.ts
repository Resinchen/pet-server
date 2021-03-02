import { Request, Response } from 'express'
import fs from 'fs'
import gameService from '../services/GameService'
import { catchable } from '../utils/decorators'
import logging from '../utils/logging'

const logger = logging('Game Controller')

class GameController {
  @catchable(logger)
  async compileGame(req: Request, res: Response) {
    logger.info('Compile game')
    const compileResult = await gameService.compile(req.params.id)
    return res.status(200).json(compileResult)
  }

  @catchable(logger)
  async getAllGamesByUserId(req: Request, res: Response) {
    logger.info(`Get all game for user ${req.userId}`)
    const games = await gameService.getAllByUserId(req.userId)
    return res.json(games)
  }

  @catchable(logger)
  async getGameInfoById(req: Request, res: Response) {
    logger.info('Get game by id')
    const game = await gameService.getById(req.params.id)
    return res.json(game)
  }

  @catchable(logger)
  async downloadGame(req: Request, res: Response) {
    logger.info('Download game')
    const outputPath = await gameService.zipping(req.params.id)

    res.download(outputPath, err => {
      if (err) {
        logger.error('Error downloading')
        res.sendStatus(500)
      }

      fs.unlinkSync(outputPath)
    })
  }

  @catchable(logger)
  async createGame(req: Request, res: Response) {
    logger.info('Create new game')
    const { title } = req.body
    const game = await gameService.create(req.userId, title)
    return res.json(game)
  }

  @catchable(logger)
  async updateGame(req: Request, res: Response) {
    logger.info('Update game')
    const newGame = gameService.update(req.params.id, req.body)
    return res.json(newGame)
  }

  @catchable(logger)
  async deleteGame(req: Request, res: Response) {
    logger.info('Delete game')
    const results = await gameService.delete(req.params.id)
    return res.send(results)
  }
}

export default new GameController()
