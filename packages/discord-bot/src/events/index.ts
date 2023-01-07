import { Client, Guild, GuildMember, PartialGuildMember } from 'discord.js'
import roleHandler, { removeUser } from './handlers/roleHandler'
import setupServer from './handlers/setupServer'
import removeServer from './handlers/deleteServerRole'

const initEvents = (client: Client) => {
  // bot joins a server
  client.on('guildCreate', (server: Guild) => setupServer(server))

  // bot leaves server, need to flush role an users from db
  client.on('guildDelete', (server: Guild) => removeServer(server))

  // when members get updated
  client.on('guildMemberUpdate', (_, member: GuildMember) =>
    roleHandler(member)
  )

  // when a member leaves a server
  client.on('guildMemberRemove', (member: GuildMember | PartialGuildMember) =>
    removeUser(member)
  )
}

export default initEvents
