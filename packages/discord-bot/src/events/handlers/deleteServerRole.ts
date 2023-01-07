import { Guild } from 'discord.js'

import { db } from '../../db'
import logger from '../../logger'

const removeServer = async (server: Guild) => {
  try {
    if (server.id !== process.env.DISCORD_SERVER_ID) {
      throw new Error(
        'Bot removed from wrong server, no manipulations provided'
      )
    }
    const serverId = (await db.Server.getServerIdByDiscordId(
      server.id
    )) as number

    const dbUserIds = await db.dbQuery(
      'DELETE FROM user_servers WHERE server_id = $1 RETURNING user_id',
      [serverId]
    )

    const dbRolesRes = await db.dbQuery(
      'DELETE FROM server_roles WHERE server_id = $1 RETURNING id',
      [serverId]
    )

    const userRolesDel = dbRolesRes.rows.map(
      async (r: { id: any }) =>
        await db.dbQuery('DELETE FROM user_roles WHERE role_id = $1', [r.id])
    )
    logger.info('Users and Role deleted from db', {
      users: dbUserIds.rows.map((u: { user_id: any }) => u.user_id),
    })
    await Promise.all(userRolesDel)
  } catch (err: any) {
    logger.error('Error deleting(almost) server', {
      name: server.name,
      id: server.id,
      error: err.message,
    })
  }
}

export default removeServer
