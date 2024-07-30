'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { jwtDecode } from 'jwt-decode'
import { ReactNode, useEffect, useRef } from 'react'

import ListenLogoutSocket from '@/components/listen-logout-socket'
import RefreshToken from '@/components/refresh-token'
import { useAppStore } from '@/hooks'
import { getAccessTokenFromLS } from '@/lib/common'
import { generateSocketInstance } from '@/lib/utils'
import { TokenPayload } from '@/types'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

export function AppProvider({ children }: { children: ReactNode }) {
  const setSocket = useAppStore((state) => state.setSocket)
  const setRole = useAppStore((state) => state.setRole)
  const socketCountRef = useRef(0)

  useEffect(() => {
    if (socketCountRef.current === 0) {
      const accessToken = getAccessTokenFromLS()

      if (accessToken) {
        const role = jwtDecode<TokenPayload>(accessToken).role
        setRole(role)

        setSocket(generateSocketInstance(accessToken))
      }
    }

    socketCountRef.current++
  }, [setRole, setSocket])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <RefreshToken />
      <ListenLogoutSocket />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
