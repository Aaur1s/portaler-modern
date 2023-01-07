import 'dotenv/config'
import logger from './logger'

import { IZoneModel, Zone } from '@portaler/types'

import getDb, { db, redis } from './db'
import FullZone from './FullZone'
import getNewFile from './getNewFile'
import worldProcess from './worldProcess'

const timer = 3600 * 12 * 1000 // 12hrs

const fileGetter = async () => {
  const fileData: FullZone[] | null = await getNewFile()

  if (!fileData) {
    return
  }

  const inserts = await worldProcess(fileData)

  inserts.forEach(async (stmt) => {
    await db.dbQuery(stmt)
  })

  const zoneRes = await db.dbQuery(
    `
  SELECT *
  FROM zones
  ORDER BY zone_name;
  `,
    []
  )

  const zoneList: Zone[] = zoneRes.rows.map((z: IZoneModel) => ({
    id: z.id,
    albionId: z.albion_id,
    name: z.zone_name,
    tier: z.tier,
    color: z.color,
    type: z.zone_type,
    isDeep: z.is_deep_road,
  }))

  await redis.setZones(zoneList)
}
;(async () => {
  await getDb()

  await fileGetter()

  setInterval(fileGetter, timer)

  logger.info('ETL started')
})()
