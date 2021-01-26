import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import Game from './Game'

export enum FileType {
  IMAGE = 'image',
  SCRIPT = 'script',
  SOUND = 'sound',
  SPRITE = 'sprite',
}

@Entity('files')
export default class Image extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column()
  name: string

  @Column()
  url: string

  @Column({ type: 'enum', enum: FileType, default: FileType.IMAGE })
  type: FileType

  @ManyToOne(() => Game, game => game.files)
  game: Game
}
