import { Request, Response } from 'express'
import fs from 'fs'
import { getRepository } from 'typeorm'
import logging from '../config/logging'
import File from '../models/File'
import Game from '../models/Game'

const logger = logging('File Controller')

function moveToGameFolder(
  oldPath: string,
  newPath: string
): boolean | undefined {
  fs.rename(oldPath, newPath, e => e && logger.error(`${e.message}`))
  return true
}

class FileController {
  async uploadFile(req: Request, res: Response) {
    logger.info('Upload file')

    const gameRepo = getRepository(Game)
    const repository = getRepository(File)

    const { gameId, type } = req.body
    const { filename } = req.file

    const game = await gameRepo.findOne(gameId)
    if (!game) {
      logger.error('Error: game not found')
      return res.sendStatus(404)
    }

    const filepath = `uploads/${game.title}/${type}/${filename}`
    const successMoved = moveToGameFolder(`uploads/${filename}`, filepath)
    if (!successMoved) {
      return res.sendStatus(500)
    }

    const file = repository.create({
      name: filename,
      url: filepath,
      type,
      game,
    })
    await repository.save(file)

    return res.json(file)
  }
}

export default new FileController()
