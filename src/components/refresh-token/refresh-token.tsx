import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { path } from '@/constants'
import { checkAndRefreshToken } from '@/lib/utils'
import { useAppContext } from '@/providers'

const UNAUTHENTICATED_PATH_LIST: string[] = [path.LOGIN, path.LOGOUT, path.REFRESH_TOKEN]

export default function RefreshToken() {
  const router = useRouter()
  const pathname = usePathname()
  const { setRole } = useAppContext()

  useEffect(() => {
    if (UNAUTHENTICATED_PATH_LIST.includes(pathname)) return

    let interval: any = null

    const handleError = () => {
      clearInterval(interval)
      setRole()
      router.push(path.LOGIN)
    }

    checkAndRefreshToken({ onError: handleError })

    const TIMEOUT = 1000

    interval = setInterval(() => checkAndRefreshToken({ onError: handleError }), TIMEOUT)

    return () => {
      clearInterval(interval)
    }
  }, [pathname, router, setRole])

  return null
}
