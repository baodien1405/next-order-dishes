import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { path } from '@/constants'
import { useAppStore, useLogoutMutation } from '@/hooks'
import { handleErrorApi } from '@/lib/utils'

const UNAUTHENTICATED_PATH_LIST: string[] = [path.LOGIN, path.LOGOUT, path.REFRESH_TOKEN]

export default function ListenLogoutSocket() {
  const router = useRouter()
  const pathname = usePathname()
  const { mutateAsync, isPending } = useLogoutMutation()
  const setRole = useAppStore((state) => state.setRole)
  const socket = useAppStore((state) => state.socket)
  const disconnectSocket = useAppStore((state) => state.disconnectSocket)

  useEffect(() => {
    if (UNAUTHENTICATED_PATH_LIST.includes(pathname)) return

    const onLogout = async () => {
      if (isPending) return

      try {
        await mutateAsync()
        setRole(undefined)
        disconnectSocket()
        router.push(path.HOME)
      } catch (error) {
        handleErrorApi({ error })
      }
    }

    socket?.on('logout', onLogout)

    return () => {
      socket?.off('logout', onLogout)
    }
  }, [pathname, router, setRole, socket, disconnectSocket, isPending, mutateAsync])

  return null
}
