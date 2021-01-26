require('dotenv').config()

const SERVER = {
  hostname: process.env.SERVER_HOSTNAME || 'localhost',
  port: process.env.SERVER_PORT || 3000,
}

const AUTH_SECRET = {
  jwt_secret_key: 'secret',
}

const config = {
  server: SERVER,
  auth: AUTH_SECRET,
}

export default config
