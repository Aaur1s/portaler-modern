import { db, redis } from './db'
import logger from './logger'

const populateServers = async () => {
  try {
    const dbServerRes = await db.dbQuery(
      `SELECT id FROM servers ORDER BY id;`,
      []
    )
    const ids: Promise<any>[] = []

    dbServerRes.rows.map((s: any) => {
      if (s.discord_id) {
        redis.setAsync(`server:${s.id}`, s.discord_id)
      }
    })

    await Promise.all([...ids])
  } catch (err: any) {
    logger.error('Error setting up servers in Redis', { error: err })
  }
}

export default populateServers
