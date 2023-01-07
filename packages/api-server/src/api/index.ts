import { Router } from 'express'

import Portals from './portal'
import UsersInfo from './user'

const router = Router()

router.use('/portal', Portals)
router.use('/user_info', UsersInfo)

export default router
