import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import 'reflect-metadata'
import config from './config/config'
import logging from './config/logging'
import './db'
import authRoutes from './routes/auth.route'
import filesRoutes from './routes/file.route'
import gamesRoutes from './routes/game.route'
import usersRoutes from './routes/user.route'

const logger = logging('Server')
const app = express()

// Logging the request
app.use((req, res, next) => {
  logger.info(
    `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`
  )

  res.on('finish', () => {
    logger.info(
      `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`
    )
  })

  next()
})

// Parse the request
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// Routes
app.use(usersRoutes)
app.use(gamesRoutes)
app.use(filesRoutes)
app.use(authRoutes)

// Error Handling
app.use((req, res, next) => {
  const error = new Error('not found')
  logger.error('Expected error', error.message)
  return res.status(404).json({ message: error.message })
})

// Create the server
app.listen(config.server.port, () =>
  logger.info(
    `Server running on ${config.server.hostname}:${config.server.port}`
  )
)
