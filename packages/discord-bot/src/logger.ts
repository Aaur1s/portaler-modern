import createLogger, { WinstonLog } from '@portaler/logger'

import { db } from './db'

const logger = createLogger(process.env.SERVICE ?? 'discord-bot')

logger.on('data', (info: WinstonLog) => {
  try {
    setImmediate(() => {
      db.Logs.winstonLog(info)
    })
  } catch (err: any) {
    console.error(err)
  }
})

export default logger
