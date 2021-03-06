import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm'
import Game from './Game.entity'

export enum FileType {
  IMAGE = 'image',
  SCRIPT = 'script',
  SOUND = 'sound',
  SPRITE = 'sprite',
}

@Entity('files')
export default class File extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column()
  name: string

  @Column()
  url: string

  @VersionColumn()
  version: number

  @Column({ type: 'enum', enum: FileType, default: FileType.IMAGE })
  type: FileType

  @ManyToOne(() => Game, game => game.files)
  game: Game
}
