import admzip from 'adm-zip'
import fs from 'fs'
import path from 'path'
import { DeleteResult, getRepository } from 'typeorm'
import VNTSCompiler from 'vntscompiler'
import Game from '../models/Game.entity'
import User from '../models/User.entity'
import ResponseError from '../utils/ResponseError'

function createGameFolder(gameName: string): void {
  const gameFolderPath = `uploads/${gameName}`
  const gameSubfolders = [
    'script',
    'sound',
    'sprite',
    'image',
    'compiled',
  ].map(folderName => path.join(gameFolderPath, folderName))

  fs.mkdir(gameFolderPath, err => {
    if (err) {
      throw new Error(`${err.message}`)
    }
    gameSubfolders.forEach(folder => fs.mkdir(folder, () => {}))
  })
}

class GameService {
  async compile(id: string): Promise<any> {
    const repo = getRepository(Game)
    const game = await repo.findOne(id)

    if (!game) {
      throw new ResponseError(404, 'Error: game not found')
    }

    try {
      VNTSCompiler.build(`uploads/${game.title}`)
    } catch (err) {
      throw new ResponseError(500, 'Can`t compile game')
    }

    return { compile: 'ok' }
  }

  async getAllByUserId(authorId: string): Promise<Game[]> {
    const repo = getRepository(Game)
    const games = await repo.find({ where: { author: authorId } })

    return games
  }

  async getById(id: string): Promise<Game> {
    const repo = getRepository(Game)
    const game = await repo
      .createQueryBuilder('games')
      .leftJoinAndSelect('games.files', 'files')
      .where('games.id = :id', { id })
      .getOne()

    if (!game) {
      throw new ResponseError(404, 'Error: game not found')
    }

    return game
  }

  async zipping(id: string): Promise<string> {
    const repo = getRepository(Game)
    const game = await repo.findOne(id)

    if (!game) {
      throw new ResponseError(404, 'Error: game not found')
    }

    const zip = new admzip()
    const outputPath = `uploads/${game.title}.zip`

    zip.addLocalFolder(`uploads/${game.title}/`)
    fs.writeFileSync(outputPath, zip.toBuffer())

    return outputPath
  }

  async create(userId: string, title: string): Promise<Game> {
    const repo = getRepository(Game)
    const gameExists = await repo.findOne({ where: { title } })

    if (gameExists) {
      throw new ResponseError(409, 'Conflict: game already exist')
    }

    const userRepo = getRepository(User)
    const user = await userRepo.findOne(userId)
    const game = repo.create({ title, author: user })

    try {
      createGameFolder(game.title)
    } catch (err) {
      throw new ResponseError(500, err.message)
    }

    await repo.save(game)

    return game
  }

  async update(id: string, newFields: any): Promise<Game> {
    const repo = getRepository(Game)
    const game = await repo.findOne(id)

    if (!game) {
      throw new ResponseError(404, ' Error: game not found')
    }

    const newGame = repo.merge(game, newFields)
    await repo.save(game)

    return newGame
  }

  async delete(id: string): Promise<DeleteResult> {
    const repo = getRepository(Game)
    const result = await repo.delete(id)

    return result
  }
}

export default new GameService()
