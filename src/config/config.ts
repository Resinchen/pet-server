require('dotenv').config()

const SERVER = {
  hostname: process.env.SERVER_HOSTNAME || 'localhost',
  port: process.env.SERVER_PORT || 3000,
}

const config = {
  server: SERVER,
}

export default config
