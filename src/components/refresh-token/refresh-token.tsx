import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { path } from '@/constants'
import { checkAndRefreshToken } from '@/lib/utils'

const UNAUTHENTICATED_PATH_LIST = [path.LOGIN, path.LOGOUT, path.REFRESH_TOKEN]

export default function RefreshToken() {
  const pathname = usePathname()

  useEffect(() => {
    if (UNAUTHENTICATED_PATH_LIST.includes(pathname)) return

    let interval: any = null

    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval)
      }
    })

    const TIMEOUT = 1000

    interval = setInterval(checkAndRefreshToken, TIMEOUT)

    return () => {
      clearInterval(interval)
    }
  }, [pathname])

  return null
}
