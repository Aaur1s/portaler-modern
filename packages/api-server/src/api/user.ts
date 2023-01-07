import { Router } from 'express'
import { UserInfo } from '@portaler/types'
import logger from '../utils/logger'
import { getUserInfo } from '../database/users'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const dbUsersInfo: UserInfo[] = await getUserInfo()
    const users_info = dbUsersInfo.map((p) => ({
      discord_name: p.discord_name,
      discord_discriminator: p.discord_discriminator,
      portals_created: p.portals_created,
    }))
    res.status(200).send(users_info)
    // public
    // res
    //   .status(200)
    //   .send("Hello! You can't parse public portaler users data, silly :)")
  } catch (err: any) {
    logger.error('Error fetching users info', {
      user: req.userId,
      server: req.serverId,
      error: err,
    })
    res.sendStatus(500)
  }
})

export default router
