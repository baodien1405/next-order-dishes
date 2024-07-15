'use client'

import { jwtDecode } from 'jwt-decode'
import { ReactNode, useContext, createContext, useState, useCallback, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import RefreshToken from '@/components/refresh-token'
import { getAccessTokenFromLS, removeAccessTokenToLS, removeRefreshTokenToLS } from '@/lib/common'
import { RoleType, TokenPayload } from '@/types'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  }
})

const AppContext = createContext({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType) => {}
})

export const useAppContext = () => {
  const context = useContext(AppContext)

  if (!context) throw Error('useAppContext must be within AppProvider')

  return context
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<RoleType>()
  const isAuth = Boolean(role)

  useEffect(() => {
    const accessToken = getAccessTokenFromLS()
    if (accessToken) {
      const role = jwtDecode<TokenPayload>(accessToken).role
      setRoleState(role)
    }
  }, [setRoleState])

  const setRole = useCallback((role?: RoleType) => {
    setRoleState(role)

    if (!role) {
      removeAccessTokenToLS()
      removeRefreshTokenToLS()
    }
  }, [])

  return (
    <AppContext.Provider value={{ isAuth, role, setRole }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  )
}
