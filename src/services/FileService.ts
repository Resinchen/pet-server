import fs from 'fs'
import { getRepository } from 'typeorm'
import File, { FileType } from '../models/File.entity'
import Game from '../models/Game.entity'
import ResponseError from '../utils/ResponseError'

function moveToGameFolder(oldPath: string, newPath: string): boolean {
  try {
    fs.renameSync(oldPath, newPath)
    return true
  } catch (err) {
    fs.unlinkSync(oldPath)
    throw new Error(`${err.message}`)
  }
}

class FileService {
  async upload(
    gameId: string,
    type: FileType,
    filename: string
  ): Promise<File> {
    const gameRepo = getRepository(Game)
    const fileRepo = getRepository(File)

    const game = await gameRepo.findOne(gameId)
    if (!game) {
      throw new ResponseError(404, 'Error: game not found')
    }

    const filepath = `uploads/${game.title}/${type}/${filename}`
    try {
      moveToGameFolder(`uploads/${filename}`, filepath)
    } catch (err) {
      throw new ResponseError(500, 'Error: can`t move file')
    }

    const file = fileRepo.create({
      name: filename,
      url: filepath,
      type,
      game,
    })

    await fileRepo.save(file)

    return file
  }

  async update(filename: string, id: string): Promise<any> {
    const repo = getRepository(File)
    const file = await repo.findOne(id)

    if (!file) {
      throw new ResponseError(404, 'Error: file not found')
    }

    try {
      moveToGameFolder(`uploads/${filename}`, file.url)
    } catch (err) {
      throw new ResponseError(500, 'Error: can`t move file')
    }

    const newNameForFile = { name: `${filename.split('.')[0]}_${Date.now()}` }

    repo.merge(file, newNameForFile)
    await repo.save(file)

    return { file, update: 'success' }
  }
}

export default new FileService()
