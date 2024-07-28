import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { path } from '@/constants'
import { useLogoutMutation } from '@/hooks'
import { handleErrorApi } from '@/lib/utils'
import { useAppContext } from '@/providers'

const UNAUTHENTICATED_PATH_LIST: string[] = [path.LOGIN, path.LOGOUT, path.REFRESH_TOKEN]

export default function ListenLogoutSocket() {
  const router = useRouter()
  const pathname = usePathname()
  const { mutateAsync, isPending } = useLogoutMutation()
  const { setRole, socket, disconnectSocket } = useAppContext()

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
