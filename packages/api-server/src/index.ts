import 'dotenv/config'

import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

import Api from './api'
import Auth from './api/auth'
import Zone from './api/zone'
import initServer from './initServer'
import syntaxError from './middleware/syntaxError'
import validator from './middleware/validator'
import verifyUser from './middleware/verifyUser'
import config from './utils/config'
import logger from './utils/logger'
import User from './api/user'

const app = express()

// initialize the server
;(async () => {
  await initServer()
  app.use(cors(config.cors))
  //  for admin
  // app.get('/api/user_info', (req, res) => {
  //   res.set('Access-Control-Allow-Origin', '*')
  //   res.status(200).send(User)
  // })
  // app.use('/api/user_info', User)

  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(compression())

  app.use(validator)
  app.use(syntaxError)

  // Un-authed routes
  app.use('/api/auth', Auth)
  app.get('/api/health', (_, res) => res.status(200).send({ server: 'ok' }))
  app.get('/api/bot', (_, res) => res.redirect(config.discord.botUrl))
  app.use('/api/zone', Zone)

  // Authed routes
  app.use('/api', verifyUser, Api)

  app.listen(config.port, () => logger.info(`Started: ${config.port}`))
})()
