import { Router } from 'express'
import { DateTime, ISOTimeOptions } from 'luxon'

import { Portal, PortalPayload } from '@portaler/types'

import {
  addServerPortal,
  deleteServerPortal,
  getServerPortals,
  IPortalModel,
  updateServerPortal,
} from '../database/portals'
import { db } from '../utils/db'
import logger from '../utils/logger'

const router = Router()

const ISO_OPTS: ISOTimeOptions = {
  suppressMilliseconds: true,
  includeOffset: false,
}

const getExpireTime = (size: string, hours: number, minutes: number) => {
  const _hours = size === 'royal' || size === 'const' ? 9999999 : Number(hours)
  const _minutes =
    size === 'royal' || size === 'const' ? 9999999 : Number(minutes)

  return DateTime.utc()
    .plus({
      hours: _hours,
      minutes: _minutes,
    })
    .toJSDate()
}

router.get('/', async (req, res) => {
  try {
    const dbPortals: IPortalModel[] = await getServerPortals(req.serverId)
    const now = DateTime.utc()

    const portals: Portal[] = dbPortals.map((p) => {
      const expires = DateTime.fromJSDate(p.expires).toUTC()

      const connection: [string, string] = [p.conn1, p.conn2].sort() as [
        string,
        string
      ]

      return {
        id: p.id,
        connection,
        size: p.size,
        expiresUtc: expires.toISO(ISO_OPTS),
        timeLeft: expires.diff(now).as('seconds'),
      }
    })

    res.status(200).send(portals)
  } catch (err: any) {
    logger.error('Error fetching portals', {
      user: req.userId,
      server: req.serverId,
      error: err,
    })

    res.sendStatus(500)
  }
})

router.post('/', async (req, res) => {
  try {
    if (req.userId === 0) {
      return res.send(401)
    }

    const body: PortalPayload = req.body

    const expires = getExpireTime(body.size, body.hours, body.minutes)

    const conns = body.connection.sort()

    const dbRes = await db.dbQuery(
      `
      SELECT id
      FROM (SELECT * FROM portals WHERE server_id = $1 AND conn1 = $2 AND conn2 = $3) portal;
    `,
      [req.serverId, conns[0], conns[1]]
    )

    if (dbRes.rowCount === 0) {
      await addServerPortal(conns, body.size, expires, req.userId, req.serverId)
    } else {
      await updateServerPortal(
        dbRes.rows[0].id,
        conns,
        body.size,
        expires,
        req.userId,
        req.serverId
      )
    }

    res.sendStatus(204)
  } catch (err: any) {
    logger.error('Error setting portals', {
      user: req.userId,
      server: req.serverId,
      error: {
        error: JSON.stringify(err),
        trace: err.stack,
      },
    })

    res.sendStatus(500)
  }
})

router.delete('/', async (req, res) => {
  try {
    if (req.userId === 0) {
      return res.sendStatus(401)
    }

    const portalIds = req.body.portals
      .map((p: number) => {
        const id = Number(p)

        if (isNaN(id)) {
          return null
        }

        return id
      })
      .filter(Boolean)

    await deleteServerPortal(portalIds, req.userId, req.serverId)
    res.sendStatus(204)
  } catch (err: any) {
    logger.error('Unable to delete', {
      user: req.userId,
      server: req.serverId,
      error: {
        error: JSON.stringify(err),
        trace: err.stack,
      },
    })
    res.sendStatus(500)
  }
})

export default router
