import { Request, Response } from 'express'
import fileService from '../services/FileService'
import { catchable } from '../utils/decorators'
import logging from '../utils/logging'

const logger = logging('File Controller')

class FileController {
  @catchable(logger)
  async uploadFile(req: Request, res: Response) {
    logger.info('Upload file')
    const { gameId, type } = req.body
    const { filename } = req.file
    const file = await fileService.upload(gameId, type, filename)

    return res.json(file)
  }

  @catchable(logger)
  async updateFile(req: Request, res: Response) {
    logger.info('Update file')
    const { filename } = req.file
    const resultUpdate = await fileService.update(filename, req.params.id)

    return res.json(resultUpdate)
  }
}

export default new FileController()
