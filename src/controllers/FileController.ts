import { Request, Response } from 'express'
import fs from 'fs'
import { getRepository } from 'typeorm'
import logging from '../config/logging'
import File from '../models/File'
import Game from '../models/Game'

const logger = logging('File Controller')

function moveToGameFolder(oldPath: string, newPath: string): boolean {
  try {
    fs.renameSync(oldPath, newPath)
    return true
  } catch (error) {
    logger.error(`${error.message}`)
    fs.unlinkSync(oldPath)
    return false
  }
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

  async updateFile(req: Request, res: Response) {
    logger.info('Update file')
    const { filename } = req.file

    const repository = getRepository(File)

    const file = await repository.findOne(req.params.id)

    if (!file) {
      logger.error('Error: file not found')
      return res.sendStatus(404)
    }

    const successMoved = moveToGameFolder(`uploads/${filename}`, file.url)
    if (!successMoved) {
      return res.sendStatus(500)
    }

    const newNameForFile = { name: `${filename.split('.')[0]}_${Date.now()}` }

    repository.merge(file, newNameForFile)
    await repository.save(file)

    return res.json({ file, update: 'success' })
  }
}

export default new FileController()
