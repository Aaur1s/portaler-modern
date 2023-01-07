import { db } from '../utils/db'
import { UserInfo } from '@portaler/types'

export const getUserInfo = async (): Promise<UserInfo[]> =>
  (
    await db.dbQuery(
      'SELECT discord_name, discord_discriminator, portals_created FROM users;',
      []
    )
  ).rows
