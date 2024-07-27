import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { path } from '@/constants'
import { checkAndRefreshToken } from '@/lib/utils'
import { useAppContext } from '@/providers'
import { socket } from '@/lib/socket'

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

    const handleRefreshToken = (force?: boolean) => {
      checkAndRefreshToken({ onError: handleError, force })
    }

    handleRefreshToken()

    const TIMEOUT = 1000

    interval = setInterval(handleRefreshToken, TIMEOUT)

    function onConnect() {
      console.log(socket.id)
    }

    function onRefreshTokenSocket() {
      handleRefreshToken(true)
    }

    function onDisconnect() {
      console.log('disconnected')
    }

    socket.on('connect', onConnect)
    socket.on('refresh-token', onRefreshTokenSocket)
    socket.on('disconnect', onDisconnect)

    return () => {
      clearInterval(interval)
      socket.off('connect', onConnect)
      socket.off('refresh-token', onRefreshTokenSocket)
      socket.off('disconnect', onDisconnect)
    }
  }, [pathname, router, setRole])

  return null
}
