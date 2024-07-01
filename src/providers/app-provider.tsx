'use client'

import { ReactNode, useContext, createContext, useState, useCallback } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import RefreshToken from '@/components/refresh-token'
import { getAccessTokenFromLS, removeAccessTokenToLS, removeRefreshTokenToLS } from '@/lib/common'

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
  setIsAuth: (isAuthenticated: boolean) => {}
})

export const useAppContext = () => {
  const context = useContext(AppContext)

  if (!context) throw Error('useAppContext must be within AppProvider')

  return context
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuth, setIsAuthState] = useState(() => Boolean(getAccessTokenFromLS()))

  const setIsAuth = useCallback((isAuthenticated: boolean) => {
    if (isAuthenticated) {
      setIsAuthState(true)
    } else {
      setIsAuthState(false)
      removeAccessTokenToLS()
      removeRefreshTokenToLS()
    }
  }, [])

  return (
    <AppContext.Provider value={{ isAuth, setIsAuth }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  )
}
