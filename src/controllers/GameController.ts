import { Request, Response } from 'express'
import fs from 'fs'
import logging from '../config/logging'
import gameService from '../services/GameService'
import ResponseError from '../utils/ResponseError'

const logger = logging('Game Controller')

class GameController {
  async compileGame(req: Request, res: Response) {
    try {
      logger.info('Compile game')
      const compileResult = await gameService.compile(req.params.id)
      return res.status(200).json(compileResult)
    } catch (e) {
      if (e instanceof ResponseError) {
        logger.error(e.message)
        return res.status(e.statusCode).json(e.message)
      }
    }
  }

  async getAllGamesByUserId(req: Request, res: Response) {
    try {
      logger.info(`Get all game for user ${req.userId}`)
      const games = await gameService.getAllByUserId(req.userId)
      return res.json(games)
    } catch (e) {
      if (e instanceof ResponseError) {
        logger.error(e.message)
        return res.status(e.statusCode).json(e.message)
      }
    }
  }

  async getGameInfoById(req: Request, res: Response) {
    try {
      logger.info('Get game by id')
      const game = await gameService.getById(req.params.id)
      return res.json(game)
    } catch (e) {
      if (e instanceof ResponseError) {
        logger.error(e.message)
        return res.status(e.statusCode).json(e.message)
      }
    }
  }

  async downloadGame(req: Request, res: Response) {
    try {
      logger.info('Download game')
      const outputPath = await gameService.zipping(req.params.id)

      res.download(outputPath, err => {
        if (err) {
          logger.error('Error downloading')
          res.sendStatus(500)
        }

        fs.unlinkSync(outputPath)
      })
    } catch (e) {
      if (e instanceof ResponseError) {
        logger.error(e.message)
        return res.status(e.statusCode).json(e.message)
      }
    }
  }

  async createGame(req: Request, res: Response) {
    try {
      logger.info('Create new game')
      const { title } = req.body
      const game = await gameService.create(req.userId, title)
      return res.json(game)
    } catch (e) {
      if (e instanceof ResponseError) {
        logger.error(e.message)
        return res.status(e.statusCode).json(e.message)
      }
    }
  }

  async updateGame(req: Request, res: Response) {
    try {
      logger.info('Update game')
      const newGame = gameService.update(req.params.id, req.body)
      return res.json(newGame)
    } catch (e) {
      if (e instanceof ResponseError) {
        logger.error(e.message)
        return res.status(e.statusCode).json(e.message)
      }
    }
  }

  async deleteGame(req: Request, res: Response) {
    try {
      logger.info('Delete game')
      const results = await gameService.delete(req.params.id)
      return res.send(results)
    } catch (e) {
      if (e instanceof ResponseError) {
        logger.error(e.message)
        return res.status(e.statusCode).json(e.message)
      }
    }
  }
}

export default new GameController()
