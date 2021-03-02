import { createConnection } from 'typeorm'
import logging from './utils/logging'

const logger = logging('DB')

createConnection().then(() =>
  logger.info('Successfully connected with database')
)
