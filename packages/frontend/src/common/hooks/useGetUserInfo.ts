import { UserInfo } from '@portaler/types'
import { useCallback, useEffect, useState } from 'react'
import fetchler from '../../fetchler'

const useGetUserInfo = (): UserInfo[] | null => {
  const [users_info, setUsersInfo] = useState<UserInfo[] | null>(null)

  const getUsersInfo = useCallback(async () => {
    const user_info: UserInfo[] = await fetchler.get('/api/user_info')
    setUsersInfo(user_info)
  }, [setUsersInfo])

  useEffect(() => {
    getUsersInfo()
  }, [getUsersInfo])

  return users_info
}

export default useGetUserInfo
