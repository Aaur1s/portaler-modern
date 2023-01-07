import { IZoneModel, Zone } from '@portaler/types'

import clearPortalInterval from './utils/clearPortalInterval'
import getDb, { db, redis } from './utils/db'
import migrations from './utils/migrations'
import populateServers from './utils/populateServers'
import { createDb } from 'postgres-migrations'
import config from './utils/config'

const initServer = async () => {
  await getDb()
  await migrations()
  await populateServers()
  await createDb(config.db.database, {
    ...config.db,
    defaultDatabase: 'postgres', // defaults to "postgres"
  })

  const zones = await redis.getZones()

  if (!zones || zones.length < 100) {
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

  clearPortalInterval()

  return true
}

export default initServer
