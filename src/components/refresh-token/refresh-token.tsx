import { useEffect } from 'react'

import { path } from '@/constants'
import { checkAndRefreshToken } from '@/lib/client-utils'
import { useAppStore } from '@/hooks'
import { usePathname, useRouter } from '@/i18n/routing'

const UNAUTHENTICATED_PATH_LIST: string[] = [path.LOGIN, path.LOGOUT, path.REFRESH_TOKEN]

export default function RefreshToken() {
  const router = useRouter()
  const pathname = usePathname()
  const setRole = useAppStore((state) => state.setRole)
  const socket = useAppStore((state) => state.socket)
  const disconnectSocket = useAppStore((state) => state.disconnectSocket)

  useEffect(() => {
    if (UNAUTHENTICATED_PATH_LIST.includes(pathname)) return

    let interval: any = null

    const handleRefreshToken = (force?: boolean) => {
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval)
          setRole(undefined)
          disconnectSocket()
          router.push(path.LOGIN)
        },
        force
      })
    }

    handleRefreshToken()

    const TIMEOUT = 1000

    interval = setInterval(handleRefreshToken, TIMEOUT)

    function onConnect() {
      console.log(socket?.id)
    }

    function onRefreshTokenSocket() {
      handleRefreshToken(true)
    }

    function onDisconnect() {
      console.log('disconnected')
    }

    socket?.on('connect', onConnect)
    socket?.on('refresh-token', onRefreshTokenSocket)
    socket?.on('disconnect', onDisconnect)

    return () => {
      clearInterval(interval)
      socket?.off('connect', onConnect)
      socket?.off('refresh-token', onRefreshTokenSocket)
      socket?.off('disconnect', onDisconnect)
    }
  }, [pathname, router, setRole, socket, disconnectSocket])

  return null
}
