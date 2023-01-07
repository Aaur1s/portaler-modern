import 'dotenv/config'

import { Client, Intents } from 'discord.js'

import getDb from './db'
import initEvents from './events'
import logger from './logger'

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
})

// Start the bot
;(async () => {
  await getDb()

  client.login(process.env.DISCORD_BOT_TOKEN)

  client.on('ready', () => {
    logger.info('Discord Bot Started')
    initEvents(client)
  })
})()
