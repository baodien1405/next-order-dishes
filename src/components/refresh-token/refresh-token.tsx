import { jwtDecode } from 'jwt-decode'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { path } from '@/constants'
import { getAccessTokenFromLS, getRefreshTokenFromLS, setAccessTokenToLS, setRefreshTokenToLS } from '@/lib/common'
import { authService } from '@/services'

export default function RefreshToken() {
  const pathname = usePathname()

  useEffect(() => {
    const UNAUTHENTICATED_PATH_LIST = [path.LOGIN, path.LOGOUT, path.REFRESH_TOKEN]
    if (UNAUTHENTICATED_PATH_LIST.includes(pathname)) return

    let interval: any = null

    const checkAndRefreshToken = async () => {
      const accessToken = getAccessTokenFromLS()
      const refreshToken = getRefreshTokenFromLS()

      if (!accessToken || !refreshToken) return

      const decodeAccessToken = jwtDecode(accessToken) as { exp: number; iat: number }
      const decodeRefreshToken = jwtDecode(refreshToken) as { exp: number; iat: number }

      const now = Math.round(new Date().getTime() / 1000)

      // case: refresh token expired
      if (decodeRefreshToken.exp <= now) return

      if (decodeAccessToken.exp - now < (decodeAccessToken.exp - decodeAccessToken.iat) / 3) {
        try {
          const response = await authService.refreshToken()

          const { accessToken, refreshToken } = response.payload.data

          setAccessTokenToLS(accessToken)
          setRefreshTokenToLS(refreshToken)
        } catch (error) {
          clearInterval(interval)
        }
      }
    }

    checkAndRefreshToken()

    const TIMEOUT = 1000

    interval = setInterval(checkAndRefreshToken, TIMEOUT)

    return () => {
      clearInterval(interval)
    }
  }, [pathname])

  return null
}
