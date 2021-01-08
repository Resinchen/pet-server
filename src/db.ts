import { createConnection } from 'typeorm'
import logging from './config/logging'

const logger = logging('DB')

createConnection().then(() =>
  logger.info('Successfully connected with database')
)
