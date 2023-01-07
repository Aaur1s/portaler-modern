import { db } from './db'
import logger from './logger'

const clearPortalInterval = () =>
  setInterval(async () => {
    try {
      await db.dbQuery(`
        DELETE FROM portals WHERE expires < NOW() AND size <> 'const';
        DELETE FROM portals WHERE size = 'royal' AND
          conn1 NOT IN (SELECT conn1 FROM portals WHERE size <> 'royal' AND size <> 'const') AND
          conn1 NOT IN (SELECT conn2 FROM portals WHERE size <> 'royal' AND size <> 'const') AND
          conn2 NOT IN (SELECT conn1 FROM portals WHERE size <> 'royal' AND size <> 'const') AND
          conn2 NOT IN (SELECT conn2 FROM portals WHERE size <> 'royal' AND size <> 'const');
      `)
    } catch (err: any) {
      logger.error('Error deleting expired portals, impossible error???', {
        error: err,
      })
    }
  }, 10000)

export default clearPortalInterval
