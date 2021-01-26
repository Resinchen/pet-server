import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm'
import File from './File'
import User from './User'

@Entity('games')
export default class Game extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column({ unique: true, nullable: false })
  title: string

  @ManyToOne(() => User, author => author.games)
  author: User

  @VersionColumn()
  version: number

  @CreateDateColumn({ name: 'created_at' })
  created_date: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updated_date: Date

  @Column({ default: 0 })
  count_players: number

  @OneToMany(() => File, file => file.game)
  files: File[]
}
