'use client'

import type { Socket } from 'socket.io-client'
import { jwtDecode } from 'jwt-decode'
import { ReactNode, useContext, createContext, useState, useCallback, useEffect, useRef } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import RefreshToken from '@/components/refresh-token'
import ListenLogoutSocket from '@/components/listen-logout-socket'
import { getAccessTokenFromLS, removeAccessTokenToLS, removeRefreshTokenToLS } from '@/lib/common'
import { RoleType, TokenPayload } from '@/types'
import { generateSocketInstance } from '@/lib/utils'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

const AppContext = createContext({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType) => {},
  socket: undefined as Socket | undefined,
  setSocket: (socket?: Socket) => {},
  disconnectSocket: () => {}
})

export const useAppContext = () => {
  const context = useContext(AppContext)

  if (!context) throw Error('useAppContext must be within AppProvider')

  return context
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | undefined>()
  const [role, setRoleState] = useState<RoleType>()
  const isAuth = Boolean(role)
  const socketCountRef = useRef(0)

  useEffect(() => {
    if (socketCountRef.current === 0) {
      const accessToken = getAccessTokenFromLS()

      if (accessToken) {
        const role = jwtDecode<TokenPayload>(accessToken).role
        setRoleState(role)

        setSocket(generateSocketInstance(accessToken))
      }
    }

    socketCountRef.current++
  }, [setRoleState])

  const setRole = useCallback((role?: RoleType) => {
    setRoleState(role)

    if (!role) {
      removeAccessTokenToLS()
      removeRefreshTokenToLS()
    }
  }, [])

  const disconnectSocket = useCallback(() => {
    socket?.disconnect()
    setSocket(undefined)
  }, [socket, setSocket])

  return (
    <AppContext.Provider value={{ isAuth, role, setRole, socket, setSocket, disconnectSocket }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ListenLogoutSocket />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  )
}
