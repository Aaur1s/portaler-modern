import { Guild, RoleData } from 'discord.js'

import { IUserModel } from '@portaler/data-models'

import config from '../../config'
import { db, redis } from '../../db'
import logger from '../../logger'

const setupServer = async (server: Guild) => {
  const rolePayload: RoleData = {
    name: config.roleName,
    permissions: [],
    color: '#aa00ff',
    hoist: false,
    mentionable: false,
  }

  try {
    let serverId = null

    const dbServer = await db.Server.getServer(server.id)
    if (!dbServer) {
      throw new Error(
        'Bot has been invited to wrong discord server, no manipulations provided'
      )
    }
    serverId = dbServer.id
    const discordRoles = await server.roles.cache

    const hasRole = discordRoles.find((r) => r.name === rolePayload.name)

    const role = hasRole || (await server.roles.create(rolePayload))
    const sid = serverId
    if (!sid) {
      throw new Error('Impossible error, how did you get there? xd')
    }
    const serverRoleId =
      hasRole && dbServer && dbServer.roles[0].id !== null
        ? dbServer.roles[0].id
        : await db.Server.createRole(sid, role.id)
    if (hasRole) {
      const members = await server.members.fetch({ force: true })

      const membersToAdd = members.filter(
        (m: { roles: { cache: { has: (arg0: any) => any } } }) =>
          m.roles.cache.has(role.id)
      )

      const usersInDbRes = await Promise.all(
        membersToAdd.map((m) => db.User.getUserByDiscord(m.id))
      )

      const usersInDb = usersInDbRes.filter(Boolean) as IUserModel[]

      const usersNotInDb = membersToAdd.filter(
        (m) => !usersInDb.find((u) => u?.discordId === m.id)
      )

      const addRolesToUsers = usersInDb.map((u) =>
        db.User.addRoles(u.id, [serverRoleId], sid)
      )

      const addUsersAndRoles = usersNotInDb.map((m) =>
        db.User.createUser(m, sid, [serverRoleId])
      )

      const discord_id =
        dbServer && dbServer.discordId ? dbServer.discordId : ''

      const addToRedis = redis.setAsync(`server:${sid}`, discord_id)

      if (discord_id) {
        await redis.setAsync(
          `server:${discord_id}`,
          JSON.stringify({
            serverId: dbServer?.id,
          })
        )
      }
      await Promise.all([addToRedis, ...addRolesToUsers, ...addUsersAndRoles])
      logger.info(
        'Attached to role ' + role.name + ' with id <' + role.id + '>'
      )
    }
    logger.info('New server with id <' + dbServer.discordId + '> created')
  } catch (err: any) {
    logger.error('Error setting up server', {
      name: server.name,
      id: server.id,
      error: err.message,
    })
  }
}

export default setupServer
